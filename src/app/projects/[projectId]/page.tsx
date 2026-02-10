import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectStatusSelect from "./ProjectStatusSelect";
import TaskDeleteButton from "./TaskDeleteButton";
import TaskStatusSelect from "./TaskStatusSelect";

interface PageProps {
  params:
    | {
        projectId?: string;
      }
    | Promise<{
        projectId?: string;
      }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const projectId =
    typeof resolvedParams?.projectId === "string"
      ? resolvedParams.projectId
      : null;

  if (!projectId) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
        include: {
          assignedTo: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const taskStats = {
    total: project.tasks.length,
    todo: project.tasks.filter((t) => t.status === "TODO").length,
    inProgress: project.tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: project.tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
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
        </nav>

        {/* Project Header */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  {project.name}
                </h1>
                <ProjectStatusSelect
                  projectId={project.id}
                  status={project.status}
                />
              </div>
              {project.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Task Statistics */}
          <div className="mt-6 grid grid-cols-4 gap-4 border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {taskStats.total}
              </p>
              <p className="mt-1 text-xs text-gray-500">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-600">
                {taskStats.todo}
              </p>
              <p className="mt-1 text-xs text-gray-500">To Do</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">
                {taskStats.inProgress}
              </p>
              <p className="mt-1 text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">
                {taskStats.done}
              </p>
              <p className="mt-1 text-xs text-gray-500">Done</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
              <p className="mt-1 text-sm text-gray-500">
                {taskStats.total} {taskStats.total === 1 ? "task" : "tasks"} in
                this project
              </p>
            </div>
            <Link
              href={`/projects/${project.id}/tasks/new`}
              className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Task
            </Link>
          </div>

          {/* Empty State */}
          {project.tasks.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto max-w-sm">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No tasks yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by creating your first task for this project
                </p>
                <Link
                  href={`/projects/${project.id}/tasks/new`}
                  className="mt-6 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Task
                </Link>
              </div>
            </div>
          ) : (
            /* Task List */
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                        <span>{task.title}</span>
                        <TaskDeleteButton taskId={task.id} />
                      </h3>
                      {task.description && (
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <TaskStatusSelect taskId={task.id} status={task.status} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          task.priority === "HIGH"
                            ? "bg-red-500"
                            : task.priority === "MEDIUM"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <span className="font-medium">{task.priority}</span>
                      <span className="text-gray-400">priority</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{task.assignedTo.name}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
