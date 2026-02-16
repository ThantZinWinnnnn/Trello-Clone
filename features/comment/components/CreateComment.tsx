"use client";

import React, { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";
import { useCreateComment } from "@/features/comment/hooks/comment.hooks";

const CreateComment = ({ session,issueId }: { session: Session | null ,issueId:string}) => {
  const [comment, setComment] = useState("");
  const {mutate:createComment} = useCreateComment(issueId);

  const createCommentFun = (e: React.KeyboardEvent<HTMLInputElement>)=>{
    const trimmedComment = comment.trim();
    if(e.key === "Enter" && trimmedComment && session?.user?.id){
      createComment({
        desc:trimmedComment,
        issueId,
        userId:session?.user?.id!
      });
      setComment("")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-7 h-7">
        <AvatarImage
          className="w-full h-full"
          src={`${session?.user?.image}` || "/photos/av1.jpeg"}
          alt="user profile photo"
        />
        <AvatarFallback>TZ</AvatarFallback>
      </Avatar>
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter a comment and press enter"
        className="w-full h-[35px] dark:bg-gray-500"
        onKeyDown={createCommentFun}
      />
    </div>
  );
};

export default memo(CreateComment);
