import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "../../utils/api.utils";
import prisma from "@/lib/prisma"

// export const GET = async(req:NextRequest,{ params }: { params: { slug: string } }) => {
//     const url = new URL(req.url)
//     const id = req.url.slice(req.url.lastIndexOf('/') + 1);
//     const uId = url.searchParams.get("userId")
    
//     return NextResponse.json({ "slug": id,"userID":uId});
// }

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const issueId = req.url.slice(req.url.lastIndexOf('/') + 1);
        const issue = await prisma?.issue.findUnique({
            where:{
              id:issueId
            },
            
        })
        return NextResponse.json(issue)
        
    } catch (error) {
        return badRequest("Invalid request for getting Issue", 400)
    }
}
