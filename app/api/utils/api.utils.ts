import { NextResponse } from "next/server";


export const badRequest = (message:string,status:number)=> NextResponse.json({message:message},{status:status})
export const updatedDate = (id:string,prismaModal:any) => prismaModal.update({where:{id},data:{updatedAt:new Date(Date.now()).toISOString()}}) 