import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", gap: "16px", padding: "40px" }}>
      <h1 style={{ fontSize: "72px", fontWeight: 800, color: "#ED553B", margin: 0 }}>404</h1>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#173F5F" }}>Page Not Found</h2>
      <p style={{ color: "#666", maxWidth: "400px", textAlign: "center" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 24px",
          background: "#173F5F",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
