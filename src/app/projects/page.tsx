import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Projects
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your projects
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            New Project
          </Link>
        </header>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto max-w-sm">
              <h3 className="text-lg font-medium text-gray-900">
                No projects yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by creating your first project
              </p>
              <Link
                href="/projects/new"
                className="mt-6 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create Project
              </Link>
            </div>
          </div>
        )}

        {/* Project List */}
        {projects.length > 0 && (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <article className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                        {project.name}
                      </h2>
                      {project.description && (
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === "ACTIVE"
                          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                          : project.status === "COMPLETED"
                          ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                          : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <time dateTime={project.createdAt.toISOString()}>
                      Created{" "}
                      {project.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
