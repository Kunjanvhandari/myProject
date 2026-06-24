"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", gap: "16px", padding: "40px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#173F5F" }}>Something went wrong!</h2>
      <p style={{ color: "#666", maxWidth: "400px", textAlign: "center" }}>
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: "10px 24px",
          background: "#ED553B",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Try again
      </button>
    </div>
  );
}
