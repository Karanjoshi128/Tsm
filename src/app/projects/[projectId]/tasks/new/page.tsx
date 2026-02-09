"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  params: {
    projectId: string;
  };
}

export default function NewTaskPage({ params }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [assignedToId, setAssignedToId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch project members
  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(
          `/api/projects/${params.projectId}/members`
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchMembers();
  }, [params.projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          status,
          projectId: params.projectId,
          assignedToId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      router.push(`/projects/${params.projectId}`);
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
            href={`/projects/${params.projectId}`}
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
            Back to Project
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Create New Task
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add a task to track work and assign team members
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

            {/* Task Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Task Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g., Design homepage mockup"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition disabled:cursor-not-allowed disabled:bg-gray-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                placeholder="Add details about what needs to be done..."
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition resize-none disabled:cursor-not-allowed disabled:bg-gray-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Priority & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition disabled:cursor-not-allowed disabled:bg-gray-50"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={loading}
                  >
                    <option value="LOW">🟢 Low</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HIGH">🔴 High</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition disabled:cursor-not-allowed disabled:bg-gray-50"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Assign To */}
            <div className="space-y-2">
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-gray-700"
              >
                Assign To
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="assignedTo"
                  required
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition disabled:cursor-not-allowed disabled:bg-gray-50"
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  disabled={loading || loadingUsers}
                >
                  <option value="">
                    {loadingUsers
                      ? "Loading team members..."
                      : "Select a team member"}
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {!loadingUsers && users.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No team members found. Add members to this project first.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Link
                href={`/projects/${params.projectId}`}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !title.trim() || !assignedToId || loadingUsers}
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
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}