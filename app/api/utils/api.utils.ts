import { NextResponse } from "next/server";


export const badRequest = (message:string,status:number)=> NextResponse.json({message:message},{status:status})