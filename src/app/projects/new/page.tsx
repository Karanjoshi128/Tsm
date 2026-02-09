"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/projects");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Create New Project
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add a new project to start organizing your tasks
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-100">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Project Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Project Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g., Website Redesign"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
                <span className="ml-1 text-sm font-normal text-gray-500">
                  (optional)
                </span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Brief description of the project goals and scope..."
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition resize-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Link
                href="/projects"
                className="rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-900"
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}