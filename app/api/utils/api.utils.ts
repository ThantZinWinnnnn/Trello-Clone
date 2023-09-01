import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const badRequest = (message: string, status: number) =>
  NextResponse.json({ message: message }, { status: status });
export const updatedDate = (id: string, prismaModal: any) =>
  prismaModal.update({
    where: { id },
    data: { updatedAt: new Date(Date.now()).toISOString() },
  });

export const sameColumnReorder = async (
  { id, oIdx, nIdx }: orderProps,
  config: ConfigProps,
  prismaModal: any
) => {
  const stl = nIdx > oIdx; //check new index > oldIndex
  const tobeReordered = await prismaModal.updateMany({
    where: {
      ...config,
      AND: [
        { order: { [stl ? "gt" : "lt"]: oIdx } },
        { order: { [stl ? "lte" : "gte"]: nIdx } },
      ],
    },
    data: { order: { [stl ? "decrement" : "increment"]: 1 } },
  });
  console.log("first",tobeReordered)

  const draggedItem = await prismaModal.update({
    where: { id },
    data: { order: nIdx },
  });
  await Promise.all([tobeReordered, draggedItem]);
  return NextResponse.json("success")
};

export const diffColumnReorder = async (
  { id, s: { sId, oIdx }, d: { dId, nIdx } }: ReorderIssue,
  prismaModal: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => {
  const tobeReorderedSource = updateIndexOrder({ id: sId, idx: oIdx, type: "source", modal: prismaModal });
  const tobeReorderedDestination = updateIndexOrder({ id: dId!, idx: nIdx, type: "destination", modal: prismaModal });

  const [leftAssignees, leftComments] = await Promise.all([
    prismaModal.assignee.findMany({ where: { issueId: id } }),
    prismaModal.comment.findMany({ where: { issueId: id } })
  ]);

  const tobeDeletedIssue = await prismaModal.issue.delete({ where: { id } });
  await prismaModal.issue.create({ data: { ...tobeDeletedIssue, order: nIdx, listId: dId } });
  const rematchedAssignees = await prismaModal.assignee.createMany({ data: leftAssignees });
  const rematchedComments = await prismaModal.comment.createMany({ data: leftComments });

  return Promise.all([tobeReorderedSource, tobeReorderedDestination, rematchedAssignees, rematchedComments])
};

const updateIndexOrder = async ({
  id,
  idx,
  type,
  modal,
}: updateIndexOrderProps) => {
  const isSource = type === "source";
  return modal.issue.updateMany({
    where: { listId: id, order: { [isSource ? "gt" : "gte"]: idx } },
    data: { order: { [isSource ? "decrement" : "increment"]: 1 } },
  });
};

interface orderProps {
  id: string;
  oIdx: number;
  nIdx: number;
}
interface ConfigProps {
  listId?: string;
  boardId?: string
}
interface updateIndexOrderProps {
  id: string;
  idx: number;
  type: string;
  modal: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

