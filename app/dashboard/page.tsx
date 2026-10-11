import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/**
 * Protected Dashboard Page
 *
 * Route: /dashboard
 * Protected by:
 * 1. middleware.ts (Edge route interceptor)
 * 2. Server-side session check (Defense-in-depth)
 */
export default async function DashboardPage() {
  const session = await auth();

  // Defense-in-depth: Ensure session exists even if middleware is bypassed
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-950/60 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">
                ● Đã xác thực (JWT Active)
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bảng Điều Khiển (Dashboard)
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trang được bảo vệ an toàn bằng NextAuth.js JWT Callback & Middleware
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Trang chủ
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 cursor-pointer"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </header>

        {/* User Profile Card */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin người dùng
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                width={80}
                height={80}
                className="rounded-full ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-2xl font-bold text-blue-600 dark:text-blue-300">
                {user.name?.charAt(0) || "U"}
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name || "Chưa thiết lập tên"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email || "Email không công khai"}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  User ID: {user.id || "N/A"}
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                  Role: {user.role || "user"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* JWT Session Inspection Card */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chi tiết Phiên làm việc (Session & JWT Claims)
            </h2>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
              Stateless JWT Session
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dữ liệu dưới đây được chuyển giao an toàn từ JWT Token thông qua <code className="text-blue-600 dark:text-blue-400">jwt callback</code> sang <code className="text-blue-600 dark:text-blue-400">session callback</code> của NextAuth:
          </p>

          <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-xs font-mono text-emerald-400 border border-gray-800">
            {JSON.stringify(session, null, 2)}
          </pre>
        </section>

        {/* Security Summary Notes */}
        <section className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-6 text-sm text-gray-700 dark:text-gray-300">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            🛡️ Cơ chế bảo mật đang hoạt động:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li><strong>Route Interception:</strong> Middleware kiểm tra JWT cookie trước khi request chạm vào Server Components.</li>
            <li><strong>Encrypted Cookie:</strong> JWT được mã hóa (JWE) với thuật toán A256GCM bằng <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">AUTH_SECRET</code>, lưu trữ với cờ <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">HttpOnly</code>, <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">SameSite=Lax</code>, và <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">Secure</code> trong môi trường production.</li>
            <li><strong>Strict Typing:</strong> User ID và Role được định kiểu tĩnh thông qua TypeScript Module Augmentation trong <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">types/next-auth.d.ts</code>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
