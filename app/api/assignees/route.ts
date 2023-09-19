import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        const deletedAssignedUser = await prisma?.assignee.delete({
            where:{id:userId!}
        })

    } catch (error) {
        
    }
}