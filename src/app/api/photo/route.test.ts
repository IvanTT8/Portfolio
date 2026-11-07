import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_PHOTO_BYTES } from "@/lib/photo";
import { createSessionToken } from "@/lib/session";

const SECRET = "x".repeat(32);
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);

const mocks = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  upload: vi.fn(),
  commit: vi.fn(),
  set: vi.fn(),
  patch: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (mocks.cookie ? { value: mocks.cookie } : undefined),
  }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: mocks.revalidateTag }));
vi.mock("@/lib/content", () => ({ CONTENT_CACHE_TAG: "sanity" }));
vi.mock("@/sanity/env", () => ({ projectId: "test", dataset: "production", apiVersion: "2025-01-01" }));
vi.mock("@sanity/client", () => ({
  createClient: () => ({ assets: { upload: mocks.upload }, patch: mocks.patch }),
}));

const { POST } = await import("./route");

function upload(file: File) {
  const body = new FormData();
  body.append("photo", file);
  return POST(new NextRequest("http://localhost/api/photo", { method: "POST", body }));
}

describe("POST /api/photo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SESSION_SECRET = SECRET;
    process.env.SANITY_WRITE_TOKEN = "token";
    mocks.cookie = createSessionToken(SECRET) ?? undefined;
    mocks.upload.mockResolvedValue({ _id: "image-abc" });
    mocks.commit.mockResolvedValue({});
    mocks.set.mockReturnValue({ commit: mocks.commit });
    mocks.patch.mockReturnValue({ set: mocks.set });
  });

  it("rejects a visitor without touching Sanity", async () => {
    mocks.cookie = undefined;
    const response = await upload(new File([JPEG], "a.jpg", { type: "image/jpeg" }));
    expect(response.status).toBe(401);
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("rejects a forged session", async () => {
    mocks.cookie = "9999999999999.forged";
    const response = await upload(new File([JPEG], "a.jpg", { type: "image/jpeg" }));
    expect(response.status).toBe(401);
  });

  it("rejects a disallowed file, even when it claims to be a JPEG", async () => {
    const response = await upload(new File(["<svg></svg>"], "a.jpg", { type: "image/jpeg" }));
    expect(response.status).toBe(415);
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("rejects an oversized file", async () => {
    const big = new Uint8Array(MAX_PHOTO_BYTES + 1);
    big.set(JPEG);
    const response = await upload(new File([big], "a.jpg", { type: "image/jpeg" }));
    expect(response.status).toBe(413);
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("uploads a valid photo, sets it on the profile and refreshes content", async () => {
    const response = await upload(new File([JPEG], "a.jpg", { type: "image/jpeg" }));
    expect(response.status).toBe(200);
    expect(mocks.upload).toHaveBeenCalledOnce();
    expect(mocks.patch).toHaveBeenCalledWith("profile");
    expect(mocks.set).toHaveBeenCalledWith({
      photo: { _type: "image", asset: { _type: "reference", _ref: "image-abc" } },
    });
    expect(mocks.revalidateTag).toHaveBeenCalledWith("sanity", { expire: 0 });
  });

  it("reports a Sanity failure without revalidating", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.upload.mockRejectedValue(new Error("boom"));
    const response = await upload(new File([JPEG], "a.jpg", { type: "image/jpeg" }));
    expect(response.status).toBe(502);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });
});
