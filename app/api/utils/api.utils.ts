import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const badRequest = (message: string, status: number) =>
  NextResponse.json({ message: message }, { status: status });


export const sameColumnReorder = async (
  { id, oIdx, nIdx }: orderProps,
  config: ConfigProps,
  model: { update: Function; updateMany: Function }
) => {
  const stl = nIdx > oIdx; //check new index > oldIndex

  const result = await prisma.$transaction([
    model.updateMany({
      where: {
        ...config,
        AND: [
          { order: { [stl ? "gt" : "lt"]: oIdx } },
          { order: { [stl ? "lte" : "gte"]: nIdx } },
        ],
      },
      data: { order: { [stl ? "decrement" : "increment"]: 1 } },
    }),
    model.update({
      where: { id },
      data: { order: nIdx },
    }),
  ]);

  return NextResponse.json({ message: result }, { status: 200 });
};

export const diffColumnReorder = async (body: ReorderIssue) => {
  const {
    id,
    s: { sId, oIdx },
    d: { dId, nIdx },
  } = body;
  const result = await prisma.$transaction([
    prisma.issue.updateMany({
      where: { listId: sId, order: { gt: oIdx } },
      data: { order: { decrement: 1 } },
    }),
    prisma.issue.updateMany({
      where: { listId: dId, order: { gte: nIdx } },
      data: { order: { increment: 1 } },
    }),
    prisma.issue.update({
      where: { id },
      data: { listId: dId, order: nIdx },
    }),
  ]);

  return NextResponse.json({ message: result }, { status: 200 });
};

interface ConfigProps {
  listId?: string;
  boardId?: string;
}

