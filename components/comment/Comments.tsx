import React from "react";
import CommentInfo from "./CommentInfo";
import { useGetComments } from "@/lib/hooks/comment.hooks";
import { comment } from "postcss";

const Comments = ({issueId}:{issueId:string}) => {
    const {data:comments,isLoading} = useGetComments(issueId);

  return (
    <section className="flex flex-col gap-2">
        {
           isLoading ? <h2>Loading...</h2> : 
           comments?.map((comment)=>(
            <CommentInfo comment={comment} key={comment.id} issueId={issueId}/>
        ))
        }
    </section>
  );
};

export default Comments;
