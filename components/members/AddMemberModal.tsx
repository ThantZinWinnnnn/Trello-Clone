"use client";
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useBoardStore } from "@/globalState/store/zustand.store";
import DropdownUser from "../utils/DropdownUser";
import { UseMutateFunction } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Toaster, toast } from "sonner";
import { X } from "lucide-react"
import { useSession } from "next-auth/react";

const AddMemberModal: React.FC<Props> = ({
  children,
  users,
  loading,
  mutate,
  boardId,
  beenAdded,
  openModal,
  closeModal,
  boardMembers
}) => {
  const {data:session} = useSession()
  const { setMemberName,setMember } = useBoardStore();
  const user = session?.user;
  const addMemberHandler = (userId:string)=>{
    mutate({boardId,userId})
  };
  const excludeLoginUser = useMemo(()=>users?.filter((usr)=>usr?.email !== user?.email),[users,user])
  return (
    <>
    <Toaster richColors position="top-center" />
    <Dialog open={openModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:bg-gray-700 max-h-[90vh] overflow-y-scroll">
        <DialogHeader className="flex justify-between items-center my-3">
          <X className="h-5 w-5 ml-auto mb-1 cursor-pointer" onClick={()=>closeModal(false)}/>
          <p className="font-rubik">Add Member</p>
          
        </DialogHeader>
        <section className="flex items-center">
          <Input
            placeholder="Enter member name"
            onChange={(e) => setMemberName(e.target.value)}
          />
          {/* // <Button>Search</Button> */}
        </section>
        <section className="flex flex-col">
          {excludeLoginUser?.map((usr) => (
            <Button variant={'ghost'} className="flex items-center justify-start gap-2" key={usr?.id}
              onClick={()=>{
                const alreadyExist = boardMembers?.some((mem)=>mem?.User?.id === usr?.id)
                if(alreadyExist){
                  toast.error("Member has already been added")
                }else{
                setMember(usr)
                addMemberHandler(usr?.id!)
                toast.success("Member has been added")
                closeModal(false)
                }
              }}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={usr?.image!} alt={usr?.name!} />
                <AvatarFallback>{usr?.name}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{usr?.name}</span>
            </Button>
          ))}
        </section>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default AddMemberModal;

interface Props {
  children: React.ReactNode;
  users: Array<UserProps>;
  loading: boolean;
  mutate: UseMutateFunction<
    any,
    unknown,
    AddMember,
    {
      previousMembers: unknown;
    }
  >;
  boardId:string,
  beenAdded:boolean,
  openModal:boolean,
  closeModal:(bol:boolean)=>void,
  boardMembers:Array<MemberProps>
}
