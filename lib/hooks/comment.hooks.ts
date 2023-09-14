import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export const useGetComments = (issueId: string) => {
    return useQuery<Array<CommentProps>>({
        queryKey: ['comments', issueId],
        queryFn: async () => {
            const response = await axios.get(`/api/comments?issueId=${issueId}`);
            return response.data;
        }
    })
};


export const useCreateComment = (issueId: string) => {
    const queryClient = useQueryClient();
    const user = useSession();
    return useMutation({
        mutationFn: async (body: CreateComment) => {
            const response = await axios.post('/api/comments', body);
            return response.data;
        },
        onMutate: async (data) => {
            const { desc, issueId, userId } = data;

            await queryClient.cancelQueries(['comments', issueId]);
            const previousComments = await queryClient.getQueryData(['comments', issueId]);
            queryClient.setQueryData(['comments', issueId], (oldComments: Array<CommentProps> | undefined) => {
                return [...oldComments!, { desc, issueId, userId, id: user?.data?.user?.id!, createdAt: "", User: user?.data?.user! }];
            });
            return {
                previousComments
            }
        },
        onError: (error, data, context) => {
            queryClient.setQueryData(['comments', issueId], context?.previousComments);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['comments', issueId]);
        }
    })
};


export const useEditComment = (issueId:string)=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async(body:UpdateComment)=>{
            const response = await axios.put("/api/comments",body);
            return response.data;
        },
        onMutate:async(data)=>{
            const {desc,commentId} = data;
            await queryClient.cancelQueries(['comments',issueId]);
            const previousComments = await queryClient.getQueryData(['comments',issueId]);
            queryClient.setQueryData(['comments',issueId],(oldComments: Array<CommentProps> | undefined)=>{
                return oldComments?.map((comment)=>{
                    if(comment.id === commentId){
                        return {...comment,desc}
                    }
                    return comment;
                })
            });
            return {
                previousComments
            }
        },
        onError:(error,data,context)=>{
            queryClient.setQueryData(['comments',issueId],context?.previousComments);
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['comments',issueId]);
        }
    })
}

export const useDeleteComment = (issueId:string)=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async(commentId:string)=>{
            const response = await axios.delete(`/api/comments?commentId=${commentId}`);
            return response.data;
        },
        onMutate:async(commentId)=>{
            await queryClient.cancelQueries(['comments',issueId]);
            const previousComments = await queryClient.getQueryData(['comments',issueId]);
            queryClient.setQueryData(['comments',issueId],(oldComments: Array<CommentProps> | undefined)=>{
                return oldComments?.filter((comment)=>comment.id !== commentId);
            });
            return {
                previousComments
            }
        },
        onError:(error,data,context)=>{
            queryClient.setQueryData(['comments',issueId],context?.previousComments);
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['comments',issueId]);
        }
    })
}