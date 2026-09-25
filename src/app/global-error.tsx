"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#000",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", padding: "24px" }}>
          <AlertTriangle size={48} style={{ color: "#ef4444" }} />
          <h1 style={{ marginTop: "24px", fontSize: "24px" }}>
            Critical Error
          </h1>
          <p style={{ marginTop: "12px", color: "#8b9198" }}>
            The app crashed. Please refresh the page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "24px",
              padding: "12px 24px",
              background: "#877eff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <RotateCcw size={16} style={{ marginRight: "8px", display: "inline" }} />
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}