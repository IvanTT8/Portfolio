import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { profile } = await getContent();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#0b0d10",
        color: "#eef0f3",
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 700 }}>{profile.name}</div>
      <div style={{ marginTop: 20, fontSize: 38, color: "#f2b64c" }}>{profile.role}</div>
      <div style={{ marginTop: 28, fontSize: 28, color: "#9aa1ad" }}>{profile.location}</div>
    </div>,
    size,
  );
}
