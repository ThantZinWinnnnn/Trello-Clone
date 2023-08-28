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
  prismaModal: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => {
  const ttb = nIdx > oIdx; //check new index > oldIndex
  const tobeReordered = await prismaModal.issue.updateMany({
    where: {
      ...config,
      AND: [
        { order: { [ttb ? "gt" : "lt"]: oIdx } },
        { order: { [ttb ? "lte" : "gte"]: nIdx } },
      ],
    },
    data: { order: { [ttb ? "decrement" : "increment"]: 1 } },
  });

  const draggedItem = await prismaModal.issue.update({
    where: { id },
    data: { order: nIdx },
  });
  return Promise.all([tobeReordered, draggedItem]);
};

export const diffColumnReorder = async (
  { id, s: { sId, oIdx }, d: { dId, nIdx } }: ReorderIssue,
  prismaModal: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) => {
    const tobeReorderedSource = updateIndexOrder({id:sId,idx:oIdx,type:"source",modal:prismaModal});
    const tobeReorderedDestination = updateIndexOrder({id:dId,idx:nIdx,type:"destination",modal:prismaModal});

    const [leftAssignees,leftComments] = await Promise.all([
        prismaModal.assignee.findMany({where:{issueId:id}}),
        prismaModal.comment.findMany({where:{issueId:id}})
    ]);

    const tobeDeletedIssue = await prismaModal.issue.delete({where:{id}});
    await prismaModal.issue.create({data:{...tobeDeletedIssue,order:nIdx,listId:dId}});
    const rematchedAssignees = await prismaModal.assignee.createMany({data:leftAssignees});
    const rematchedComments = await prismaModal.comment.createMany({data:leftComments});

    return Promise.all([tobeReorderedSource,tobeReorderedDestination,rematchedAssignees,rematchedComments])
};

const updateIndexOrder = async ({
  id,
  idx,
  type,
  modal,
}: updateIndexOrderProps) => {
  const isSource = type === "source";
  return modal.issue.updateMany({
    where: { listId: id, order: { [isSource ? "gt" : "lt"]: idx } },
    data: { order: { [isSource ? "decrement" : "increment"]: 1 } },
  });
};

interface orderProps {
  id: string;
  oIdx: number;
  nIdx: number;
}
interface ConfigProps {
  listId: string;
}
type schema = "issue" | "list";
interface updateIndexOrderProps {
  id: string;
  idx: number;
  type: string;
  modal: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}
// interface sameColumnReorderProps{
//     order:orderProps,
//     config:{
//         id:string
//     },
//     prismaModal:PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//     schema:schema
// }
