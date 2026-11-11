import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffc300",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 999,
            background: "radial-gradient(circle at 45% 40%, #ffe46b, #ffb703)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              width: 170,
              height: 48,
              background: "#d90429",
              transform: "rotate(-8deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 40,
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: 2,
            }}
          >
            CL
          </div>
        </div>
      </div>
    ),
    size
  );
}
