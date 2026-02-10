"use client";

import { TaskStatus } from "@prisma/client";

type Props = {
  taskId: string;
  status: TaskStatus;
};

export default function TaskStatusSelect({ taskId, status }: Props) {
  return (
    <select
      className="border rounded px-2 py-1 text-xs"
      value={status}
      onChange={async (e) => {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: e.target.value }),
        });

        window.location.reload();
      }}
    >
      <option value="TODO">Todo</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="DONE">Done</option>
    </select>
  );
}
