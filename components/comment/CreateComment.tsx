"use client";

import React, { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Session } from "next-auth";
import { useCreateComment } from "@/lib/hooks/comment.hooks";

const CreateComment = ({ session,issueId }: { session: Session ,issueId:string}) => {
  const [comment, setComment] = useState("");
  const {mutate:createComment} = useCreateComment(issueId);

  const createCommentFun = (e: React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key === "Enter"){
      createComment({
        desc:comment,
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
        className="w-full h-[35px]"
        onKeyDown={createCommentFun}
      />
    </div>
  );
};

export default memo(CreateComment);
