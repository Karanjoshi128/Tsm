import {
  PrismaClient,
  ProjectStatus,
  Priority,
  Role,
  TaskStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Reset project data for deterministic seeding
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();

  // 1️⃣ Seed Users (so seeding works on a fresh DB)
  const adminEmail = "admin@test.com";
  const adminPassword = "admin123";
  const memberPassword = "member123";

  const adminHashed = await bcrypt.hash(adminPassword, 10);
  const memberHashed = await bcrypt.hash(memberPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHashed,
      role: Role.ADMIN,
      name: "Admin User",
    },
    create: {
      email: adminEmail,
      password: adminHashed,
      role: Role.ADMIN,
      name: "Admin User",
    },
  });

  const members = [] as { id: string; email: string; name: string }[];
  for (let i = 1; i <= 9; i++) {
    const email = `karan${i}@gmail.com`;
    const name = `Karan ${i}`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: memberHashed,
        role: Role.MEMBER,
        name,
      },
      create: {
        email,
        password: memberHashed,
        role: Role.MEMBER,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    members.push(user);
  }

  // 2️⃣ Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Task Management System",
      description: "Internal task management platform",
      status: ProjectStatus.ACTIVE,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Marketing Website",
      description: "Company marketing site revamp",
      status: ProjectStatus.ACTIVE,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Mobile App MVP",
      description: "Initial MVP for mobile application",
      status: ProjectStatus.ON_HOLD,
    },
  });

  const projects = [project1, project2, project3];

  // 3️⃣ Assign members to projects
  for (const project of projects) {
    for (const member of members) {
      await prisma.projectMember.upsert({
        where: {
          userId_projectId: {
            userId: member.id,
            projectId: project.id,
          },
        },
        update: {},
        create: {
          projectId: project.id,
          userId: member.id,
        },
      });
    }
  }

  // 4️⃣ Create Tasks
  const taskTemplates = [
    {
      title: "Design UI",
      priority: Priority.HIGH,
      status: TaskStatus.TODO,
    },
    {
      title: "Build API",
      priority: Priority.HIGH,
      status: TaskStatus.IN_PROGRESS,
    },
    {
      title: "Write Documentation",
      priority: Priority.MEDIUM,
      status: TaskStatus.DONE,
    },
    {
      title: "Testing & QA",
      priority: Priority.LOW,
      status: TaskStatus.TODO,
    },
  ];

  for (const project of projects) {
    for (let i = 0; i < taskTemplates.length; i++) {
      const member = members[i % members.length];

      await prisma.task.create({
        data: {
          title: taskTemplates[i].title,
          description: `${taskTemplates[i].title} for ${project.name}`,
          priority: taskTemplates[i].priority,
          status: taskTemplates[i].status,
          projectId: project.id,
          assignedToId: member.id,
        },
      });
    }
  }

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
