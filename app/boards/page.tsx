"use client";
import React,{memo} from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

//components
import ProjectBoard from "@/components/utils/ProjectBoard";
import { Toaster, toast } from "sonner";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useGetBoards } from "@/lib/hooks/board.hooks";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AssignedBoards from "@/components/Board/AssignedBoards";

const BoardsPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const {successBoardCreation,setBoards,setSuccessBoardCreation,removeORLeaveBoard} = useBoardStore();

  const {data:userBoards,isLoading,isSuccess,isFetching,isError} = useGetBoards(session)

  // if (isLoading || isFetching) <Loading />;

  if (successBoardCreation === "success") {
      toast.success("Successfully created new board.");
      setSuccessBoardCreation("")
   }
   if(isError && successBoardCreation === "failed"){
    toast.error("Unsuccessfully while creating new board.");
   }
   if(removeORLeaveBoard === "removed" ){
    toast.success("Successfully removed board.");
   }else if(removeORLeaveBoard === "leave"){
    toast.success("Successfully left board.");
   };

   const createdBoards = userBoards?.createdBoards?.boards
   const assignedBoards = userBoards?.assignedBoards;
   const filterAssignedBoards = assignedBoards?.filter((board)=> board.userId !== session?.user?.id);
   console.log("userId",session?.user?.id)
  return (
    <>
    <Toaster richColors position="top-center" />
    <main className="p-3">
      <ProjectBoard boards={createdBoards!} isLoading={isLoading}/>
      {
        filterAssignedBoards?.length ? (
          <section>
            <Separator className="my-4"/>
              <Label className="mb-5">Assigned Boards</Label>
              <AssignedBoards boards={filterAssignedBoards!} isLoading={isLoading}/>
          </section>
        ):
        null
      }
    </main>
    </>
  );
}

export default memo(BoardsPage);
