import React from "react";
import CommentInfo from "./CommentInfo";
import { useGetComments } from "@/features/comment/hooks/comment.hooks";
import CommentSk from "@/components/skeleton/CommentSk";

const Comments = ({issueId}:{issueId:string}) => {
    const {data:comments,isLoading} = useGetComments(issueId);

  return (
    <section className="flex flex-col gap-2 overflow-y-scroll">
        {
           isLoading ? 
           <CommentSk/> : 
           comments?.map((comment)=>(
            <CommentInfo comment={comment} key={comment.id} issueId={issueId}/>
        ))
        }
    </section>
  );
};

export default Comments;
