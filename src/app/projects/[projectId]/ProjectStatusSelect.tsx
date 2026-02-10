"use client";

import { ProjectStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  projectId: string;
  status: ProjectStatus;
};

function statusClasses(status: ProjectStatus) {
  if (status === "ACTIVE") {
    return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20";
  }
  if (status === "COMPLETED") {
    return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";
  }
  return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20";
}

export default function ProjectStatusSelect({ projectId, status }: Props) {
  const router = useRouter();
  const [value, setValue] = useState<ProjectStatus>(status);
  const [isPending, startTransition] = useTransition();

  async function update(nextStatus: ProjectStatus) {
    const prev = value;
    setValue(nextStatus);

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      setValue(prev);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => update(e.target.value as ProjectStatus)}
        disabled={isPending}
        className={`inline-flex appearance-none items-center rounded-full px-2.5 py-0.5 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${statusClasses(
          value,
        )}`}
        aria-label="Project status"
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="ON_HOLD">ON_HOLD</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current opacity-70"
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
  );
}
