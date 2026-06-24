export default function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f0f0f0",
            borderTop: "4px solid #ED553B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#888", fontSize: "14px" }}>Loading...</p>
      </div>
    </div>
  );
}
