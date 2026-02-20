import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const run = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
    take: 6,
    orderBy: { id: "asc" },
  });

  if (users.length === 0) {
    console.log("No users found. Skip seeding roles.");
    return;
  }

  const owner = users[0];
  const boardName = process.env.DEMO_BOARD_NAME ?? "BoardForge Demo Board";

  const board = await prisma.board.upsert({
    where: {
      id: process.env.DEMO_BOARD_ID ?? "00000000-0000-0000-0000-000000000001",
    },
    update: {
      name: boardName,
      userId: owner.id,
    },
    create: {
      id: process.env.DEMO_BOARD_ID ?? "00000000-0000-0000-0000-000000000001",
      name: boardName,
      userId: owner.id,
    },
  });

  const ownerMember = await prisma.member.findFirst({
    where: {
      boardId: board.id,
      userId: owner.id,
    },
    select: { id: true },
  });

  if (ownerMember) {
    await prisma.member.update({
      where: { id: ownerMember.id },
      data: {
        role: "OWNER",
        isAdmin: true,
      },
    });
  } else {
    await prisma.member.create({
      data: {
        boardId: board.id,
        userId: owner.id,
        role: "OWNER",
        isAdmin: true,
      },
    });
  }

  const assignments: Array<"ADMIN" | "MEMBER" | "VIEWER"> = [
    "ADMIN",
    "MEMBER",
    "VIEWER",
  ];

  for (let i = 1; i < users.length; i += 1) {
    const user = users[i];
    const role = assignments[(i - 1) % assignments.length];

    const existingMember = await prisma.member.findFirst({
      where: {
        boardId: board.id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (existingMember) {
      await prisma.member.update({
        where: { id: existingMember.id },
        data: {
          role,
          isAdmin: role === "ADMIN",
        },
      });
      continue;
    }

    await prisma.member.create({
      data: {
        boardId: board.id,
        userId: user.id,
        role,
        isAdmin: role === "ADMIN",
      },
    });
  }

  // Backfill existing member rows in other boards.
  await prisma.member.updateMany({
    where: {
      role: "MEMBER",
      isAdmin: true,
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`Seeded demo RBAC board: ${board.id}`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
