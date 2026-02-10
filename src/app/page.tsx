import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import HomeHero from "./HomeHero";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg w-full mx-4">
        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-gray-900 to-gray-800 px-8 py-10 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <HomeHero />
            <p className="mt-2 text-sm text-gray-300">
              Streamline your workflow with role-based task management
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8 space-y-6">
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Role-Based Access
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Admin and member roles with different permissions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Project Organization
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Group tasks by projects for better tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Real-Time Updates
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Stay synced with your team&apos;s progress
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/login"
              className="block w-full rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
            >
              Get Started
            </Link>

            {/* Tech Stack */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 text-center mb-3">
                Built with modern technologies
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="font-medium">Next.js</span>
                <span>•</span>
                <span className="font-medium">Prisma</span>
                <span>•</span>
                <span className="font-medium">NextAuth</span>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Demo Credentials
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-gray-200">
                    <span className="text-xs text-gray-600">Admin</span>
                    <code className="text-xs font-mono text-gray-900">
                      admin@test.com
                    </code>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-gray-200">
                    <span className="text-xs text-gray-600">Members</span>
                    <code className="text-xs font-mono text-gray-900">
                      karan1-9@gmail.com
                    </code>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Use any demo account to explore the system
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Secure authentication powered by NextAuth.js
        </p>
      </div>
    </main>
  );
}
