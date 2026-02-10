import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const isAdmin = session.user.role === "ADMIN";

  // Fetch tasks based on role
  const tasks = await prisma.task.findMany({
    where: isAdmin
      ? {}
      : {
          assignedToId: session.user.id,
        },
    include: {
      project: true,
      assignedTo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group tasks by status
  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  // Project-wise task count
  const projectTaskCount: Record<string, number> = {};
  tasks.forEach((task) => {
    const projectName = task.project.name;
    projectTaskCount[projectName] =
      (projectTaskCount[projectName] || 0) + 1;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isAdmin
              ? "Overview of all tasks and projects"
              : "Overview of your assigned tasks"}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">To Do</p>
              <div className="rounded-full bg-gray-100 p-2">
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {tasksByStatus.TODO.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {tasksByStatus.TODO.length === 1 ? "task" : "tasks"} pending
            </p>
          </div>

          <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <div className="rounded-full bg-blue-100 p-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-blue-600">
              {tasksByStatus.IN_PROGRESS.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {tasksByStatus.IN_PROGRESS.length === 1 ? "task" : "tasks"} active
            </p>
          </div>

          <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <div className="rounded-full bg-green-100 p-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-green-600">
              {tasksByStatus.DONE.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {tasksByStatus.DONE.length === 1 ? "task" : "tasks"} finished
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Task List - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isAdmin ? "All Tasks" : "My Tasks"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
                </p>
              </div>

              <div className="p-6">
                {tasks.length === 0 ? (
                  <div className="py-12 text-center">
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
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No tasks assigned
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {isAdmin
                        ? "Create a project and add tasks to get started"
                        : "You don't have any tasks assigned yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <article
                        key={task.id}
                        className="group rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                              {task.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                  />
                                </svg>
                                {task.project.name}
                              </span>
                              {isAdmin && (
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="h-3.5 w-3.5"
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
                                  {task.assignedTo.name}
                                </span>
                              )}
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  task.priority === "HIGH"
                                    ? "bg-red-500"
                                    : task.priority === "MEDIUM"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                              />
                              <span className="font-medium">
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              task.status === "DONE"
                                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                                : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Distribution - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tasks by Project
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Distribution across projects
                </p>
              </div>

              <div className="p-6">
                {Object.keys(projectTaskCount).length === 0 ? (
                  <div className="py-8 text-center">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <p className="mt-3 text-sm text-gray-500">
                      No project data
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(projectTaskCount)
                      .sort(([, a], [, b]) => b - a)
                      .map(([project, count]) => (
                        <div
                          key={project}
                          className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {project}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-gray-900 transition-all"
                                style={{
                                  width: `${
                                    (count / tasks.length) * 100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="w-8 text-right text-sm font-semibold text-gray-900">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions - Admin Only */}
            {isAdmin && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/projects/new"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg
                      className="h-4 w-4"
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
                    New Project
                  </Link>
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    View All Projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}