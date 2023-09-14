"use client";

import React, { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { formatDate } from "../utils/util";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { useDeleteComment, useEditComment } from "@/lib/hooks/comment.hooks";

const CommentInfo = ({
  comment,
  issueId,
}: {
  comment: CommentProps;
  issueId: string;
}) => {
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState(comment?.desc);
  const { data: session } = useSession();
  const { mutate: updateComment } = useEditComment(issueId);
  const { mutate: deleteComment } = useDeleteComment(issueId);

  const currentUser = comment?.User?.id === session?.user?.id;
  const invalid = comment?.createdAt === "";
  const commentEditHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateComment({ desc: editComment!, commentId: comment?.id! });
      setEdit(false);
    }
  };

  const commentDeleteHandler = () => {
    deleteComment(comment?.id!);
  };
  return (
    <section className="flex gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage
          className="w-full h-full"
          src={`${comment?.User?.image}` || "/photos/av1.jpeg"}
          alt="user profile photo"
        />
        <AvatarFallback>{comment?.User?.name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-medium flex gap-3 items-center">
          <span className="text-gray-500 font-medium">
            {comment?.User?.name}
            {currentUser && <span className="inline-block ml-1">(you)</span>}
          </span>
          <span className="text-slate-400 text-[0.68rem]">
            {invalid ? "a few seconds ago" : formatDate(comment?.createdAt!)}
          </span>
        </h3>
        {edit ? (
          <Input
            type="text"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            onKeyDown={commentEditHandler}
            className="w-full text-xs"
          />
        ) : (
          <p className="text-xs font-rubik font-medium">{comment?.desc}</p>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant={"link"}
            className="text-xs px-0 hover:text-blue-700"
            onClick={() => setEdit(!edit)}
          >
            Edit
          </Button>
          <Button
            variant={"link"}
            className="text-xs px-0 hover:text-blue-700"
            onClick={commentDeleteHandler}
          >
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
};

export default memo(CommentInfo);
