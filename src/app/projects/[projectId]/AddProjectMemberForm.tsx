"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectMemberForm({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Failed to add member");
        setLoading(false);
        return;
      }

      const data = await res.json().catch(() => null);
      const addedEmail = typeof data?.email === "string" ? data.email : email;

      setSuccess(`Added ${addedEmail}`);
      setEmail("");
      setLoading(false);
      router.refresh();
    } catch {
      setError("Failed to add member");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <label className="sr-only" htmlFor="memberEmail">
          Member email
        </label>
        <input
          id="memberEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          disabled={loading}
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add user"}
        </button>

        {error && <span className="text-sm text-red-600">{error}</span>}
        {success && <span className="text-sm text-green-700">{success}</span>}
      </div>
    </form>
  );
}
