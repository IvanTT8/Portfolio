import { existsSync, readFileSync } from "node:fs";
import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { buildSeedDocuments } from "@seed/documents";
import { resume } from "@seed/resume";
import { mapSiteContent, type RawSiteContent } from "@/sanity/map";
import { SITE_CONTENT_QUERY } from "@/sanity/queries";
import { buildContactMailto } from "./contact";
import { estimateReadMinutes, formatFullDate, formatPeriod, formatPhone, repeatToFill, shortSkillNames, whatsappUrl } from "./format";
import { supportsYearsClaim } from "./launch";
import { buildNav } from "./navigation";
import { checkPhoto, MAX_PHOTO_BYTES } from "./photo";
import { createLoginLimiter } from "./rate-limit";
import { createSessionToken, isCorrectPassword, isValidSessionToken } from "./session";
import { HERO_PHOTOS } from "./site";
import { techMentioned } from "./tech-mentions";

const SECRET = "x".repeat(32);

describe("launch check", () => {
  const now = new Date("2026-11-03T00:00:00Z");

  it("fails on the resume's current roles, which start in 2019", () => {
    expect(supportsYearsClaim(resume.experience, now)).toBe(false);
  });

  it("passes once Experience started 10 or more years ago", () => {
    expect(supportsYearsClaim([{ start: "2016-11-03" }], now)).toBe(true);
    expect(supportsYearsClaim([{ start: "2016-11-04" }], now)).toBe(false);
  });

  it("fails with no Experience", () => {
    expect(supportsYearsClaim([], now)).toBe(false);
  });
});

describe("Hidden Sections", () => {
  it("leaves Blogs out of the nav when empty", () => {
    const hrefs = buildNav(resume).map((link) => link.href);
    expect(hrefs).not.toContain("/blogs");
  });

  it("shows Work for Selected Work alone, and drops it when there's no work at all", () => {
    expect(buildNav(resume).map((link) => link.href)).toContain("/projects");
    const noWork = buildNav({ ...resume, selectedWork: [], projects: [] });
    expect(noWork.map((link) => link.href)).not.toContain("/projects");
  });

  it("adds Blogs to the nav once there's a post", () => {
    const hrefs = buildNav({
      ...resume,
      posts: [{ title: "B", slug: "b", excerpt: "E", publishedAt: "2026-01-01" }],
    }).map((link) => link.href);
    expect(hrefs).toContain("/blogs");
  });
});

describe("tech chips", () => {
  it("lists only technologies a role's highlights name", () => {
    expect(techMentioned(["Built with React Native and Pinecone."])).toEqual(["React Native", "Pinecone"]);
    expect(techMentioned(["Used MySQL and SQL."])).toEqual(["MySQL", "SQL"]);
    expect(techMentioned(undefined)).toEqual([]);
  });
});

describe("session", () => {
  it("accepts its own token until it expires", () => {
    const token = createSessionToken(SECRET, 1000) as string;
    expect(isValidSessionToken(token, SECRET, 1001)).toBe(true);
    expect(isValidSessionToken(token, SECRET, 1000 + 9 * 60 * 60 * 1000)).toBe(false);
  });

  it("rejects tampered tokens, other secrets and missing tokens", () => {
    const token = createSessionToken(SECRET, 1000) as string;
    const [, signature] = token.split(".");
    expect(isValidSessionToken(`9999999999999.${signature}`, SECRET, 1001)).toBe(false);
    expect(isValidSessionToken(token, "y".repeat(32), 1001)).toBe(false);
    expect(isValidSessionToken(undefined, SECRET)).toBe(false);
  });

  it("refuses a short or missing secret", () => {
    expect(createSessionToken("short")).toBeNull();
    expect(createSessionToken(undefined)).toBeNull();
    expect(isValidSessionToken("1.a", undefined)).toBe(false);
  });

  it("fails sign-in when no password is configured", () => {
    expect(isCorrectPassword("", undefined)).toBe(false);
    expect(isCorrectPassword("anything", "")).toBe(false);
    expect(isCorrectPassword("wrong", "right")).toBe(false);
    expect(isCorrectPassword("right", "right")).toBe(true);
  });
});

describe("login limiter", () => {
  it("blocks after 5 failures, then clears after the window", () => {
    const limiter = createLoginLimiter();
    for (let i = 0; i < 5; i += 1) limiter.recordFailure("ip", 0);
    expect(limiter.isBlocked("ip", 1)).toBe(true);
    expect(limiter.isBlocked("other", 1)).toBe(false);
    expect(limiter.isBlocked("ip", 15 * 60 * 1000 + 1)).toBe(false);
  });
});

describe("photo check", () => {
  const withBytes = (...bytes: number[]) => new Uint8Array([...bytes, ...new Array(20).fill(0)]);
  const ascii = (text: string) => [...text].map((char) => char.charCodeAt(0));

  it("identifies allowed formats from their bytes", () => {
    expect(checkPhoto(withBytes(0xff, 0xd8, 0xff))).toEqual({ ok: true, type: "image/jpeg" });
    expect(checkPhoto(withBytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toEqual({
      ok: true,
      type: "image/png",
    });
    expect(checkPhoto(withBytes(...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")))).toEqual({
      ok: true,
      type: "image/webp",
    });
  });

  it("rejects other formats, empty files and oversized files", () => {
    expect(checkPhoto(withBytes(...ascii("<svg")))).toMatchObject({ ok: false, status: 415 });
    expect(checkPhoto(new Uint8Array())).toMatchObject({ ok: false, status: 400 });
    const oversized = new Uint8Array(MAX_PHOTO_BYTES + 1);
    oversized.set([0xff, 0xd8, 0xff]);
    expect(checkPhoto(oversized)).toMatchObject({ ok: false, status: 413 });
  });
});

describe("contact form", () => {
  it("builds an encoded mailto link with the visitor's details", () => {
    const link = buildContactMailto("me@example.com", { name: "A & B", email: "a@b.co", message: "Hi?" });
    expect(link.startsWith("mailto:me@example.com?subject=")).toBe(true);
    expect(link).toContain(encodeURIComponent("Portfolio message from A & B"));
    expect(decodeURIComponent(link.split("body=")[1])).toBe("Hi?\n\nA & B\na@b.co");
  });
});

describe("formatting", () => {
  it("repeats short lists in whole rounds, for the slider", () => {
    expect(repeatToFill(["a"], 3)).toEqual(["a", "a", "a"]);
    expect(repeatToFill(["a", "b"], 3)).toEqual(["a", "b", "a", "b"]);
    expect(repeatToFill(["a", "b", "c"], 2)).toEqual(["a", "b", "c"]);
    expect(repeatToFill([], 3)).toEqual([]);
  });

  it("estimates read time, with a one-minute minimum", () => {
    expect(estimateReadMinutes(undefined)).toBe(1);
    const words = Array.from({ length: 450 }, () => "word").join(" ");
    expect(estimateReadMinutes([{ children: [{ text: words }] }])).toBe(3);
  });

  it("formats a full date", () => {
    expect(formatFullDate("2026-02-27")).toBe("February 27, 2026");
  });

  it("formats periods, phone numbers and short skill names", () => {
    expect(formatPeriod("2024-02-01")).toBe("Feb 2024 – Present");
    expect(formatPeriod("2022-03-01", "2024-01-31")).toBe("Mar 2022 – Jan 2024");
    expect(formatPhone("+5493644710549")).toBe("+54 9 3644 710549");
    expect(whatsappUrl("+5493644710549")).toBe("https://wa.me/5493644710549");
    expect(shortSkillNames(["AWS (EC2, S3)", "AWS", "Docker"])).toEqual(["AWS", "Docker"]);
  });
});

describe("resume content", () => {
  it("has the contact details from the resume", () => {
    expect(resume.profile.email).toBe("ivanttorrente@gmail.com");
    expect(resume.profile.phone).toBe("+5493644710549");
    expect(resume.profile.linkedin).toContain("linkedin.com/in/ivan-torrente-243878184");
  });

  it("has a profile photo, and the file exists", () => {
    expect(resume.profile.photoUrl).toBe("/photos/navy-suit.jpg");
    expect(existsSync(`public${resume.profile.photoUrl}`)).toBe(true);
  });

  it("has a file for every other card in the hero stack", () => {
    expect(HERO_PHOTOS).toHaveLength(3);
    for (const photo of HERO_PHOTOS) expect(existsSync(`public${photo}`)).toBe(true);
  });

  it("has the real recommendations, each with its avatar file", () => {
    expect(resume.testimonials.map((review) => review.name)).toEqual(["Sean Tung", "Victor Adolfo Valenzuela Bustos", "Brian Plunkett"]);
    for (const review of resume.testimonials) expect(existsSync(`public${review.avatarUrl}`)).toBe(true);
  });

  it("has all 8 technical skill categories", () => {
    expect(resume.skills).toHaveLength(8);
  });

  it("doesn't include any reference site details", () => {
    const text = readFileSync("content-seed/resume.ts", "utf8").toLowerCase();
    for (const term of ["naseem", "rawalpindi", "bulkup", "visric"]) {
      expect(text).not.toContain(term);
    }
  });
});

describe("Sanity query", () => {
  async function runQuery(extra: Record<string, unknown>[] = []) {
    const dataset = [...buildSeedDocuments(resume), ...extra];
    const result = await evaluate(parse(SITE_CONTENT_QUERY), { dataset });
    return (await result.get()) as RawSiteContent;
  }

  const imageUrl = (source: unknown) => (source ? "https://cdn.sanity.io/image.jpg" : undefined);

  it("returns seeded documents in resume order, matching the local preview", async () => {
    const content = mapSiteContent(await runQuery(), imageUrl);
    expect(content.skills).toEqual(resume.skills);
    expect(content.experience).toEqual(resume.experience);
    expect(content.selectedWork).toEqual(resume.selectedWork);
    expect(content.education).toEqual(resume.education);
    expect(content.languages).toEqual(resume.languages);
    expect(content.nowCards).toEqual(resume.nowCards);
    expect(content.profile.email).toBe(resume.profile.email);
    expect(content.profile.photoUrl).toBe("/photos/navy-suit.jpg");
    expect(content.posts).toEqual([]);
    expect(content.testimonials.map((review) => review.quote)).toEqual(resume.testimonials.map((review) => review.quote));
  });

  it("sorts Earlier Experience after newer roles", async () => {
    const raw = await runQuery([
      { _id: "early", _type: "experience", title: "Early", company: "A", location: "B", start: "2015-01-01" },
    ]);
    expect(mapSiteContent(raw, imageUrl).experience.at(-1)?.title).toBe("Early");
  });

  it("maps a published photo and post", async () => {
    const raw = await runQuery([
      {
        _id: "post",
        _type: "blogPost",
        title: "Post",
        slug: { current: "post" },
        excerpt: "E",
        publishedAt: "2026-01-01",
      },
    ]);
    raw.profile.photo = { asset: { _ref: "image-abc-10x10-jpg" } };
    const content = mapSiteContent(raw, imageUrl);
    expect(content.profile.photoUrl).toBe("https://cdn.sanity.io/image.jpg");
    expect(content.posts[0].slug).toBe("post");
    expect(content.posts[0].coverUrl).toBeUndefined();
  });

  it("gives a clear error when Sanity hasn't been seeded", () => {
    expect(() =>
      mapSiteContent({ profile: null } as unknown as RawSiteContent, imageUrl),
    ).toThrow(/npm run seed/);
  });
});
