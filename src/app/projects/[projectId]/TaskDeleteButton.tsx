"use client";

type Props = {
  taskId: string;
};

export default function TaskDeleteButton({ taskId }: Props) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Delete this task?")) return;

        await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        });

        window.location.reload();
      }}
      className="text-xs text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
