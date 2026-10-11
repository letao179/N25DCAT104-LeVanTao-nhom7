import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Kiểm tra trạng thái xác thực</h1>
      <p style={{ color: "#666", marginTop: "0.5rem" }}>
        Next.js App Router + NextAuth.js v5 (JWT Authentication)
      </p>

      {/* Quick Navigation */}
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/dashboard"
          style={{
            padding: "0.5rem 1rem",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
          }}
        >
          Truy cập Dashboard (Trang được bảo vệ) →
        </Link>
        {!session && (
          <Link
            href="/login"
            style={{
              padding: "0.5rem 1rem",
              background: "#4b5563",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            Trang Đăng Nhập (/login)
          </Link>
        )}
      </div>

      {session ? (
        <div style={{ border: "1px solid green", borderRadius: "8px", padding: "1.5rem", marginTop: "1.5rem", backgroundColor: "#f0fdf4" }}>
          <h2 style={{ color: "#166534", marginTop: 0 }}>Đã đăng nhập thành công!</h2>
          <p><strong>Tên:</strong> {session.user?.name}</p>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>User ID (từ JWT):</strong> {session.user?.id || "N/A"}</p>
          <p><strong>Role (từ JWT):</strong> {session.user?.role || "user"}</p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", alignItems: "center" }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#16a34a",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500",
              }}
            >
              Vào Dashboard
            </Link>

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ border: "1px solid red", borderRadius: "8px", padding: "1.5rem", marginTop: "1.5rem", backgroundColor: "#fef2f2" }}>
          <h2 style={{ color: "#991b1b", marginTop: 0 }}>Chưa đăng nhập</h2>
          <p>Bạn cần hoàn thành bài tập hoặc đăng nhập để truy cập các trang được bảo vệ.</p>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#24292e",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500",
              }}
            >
              Đăng nhập bằng GitHub
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}