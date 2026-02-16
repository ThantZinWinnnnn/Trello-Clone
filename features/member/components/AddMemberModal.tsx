"use client";
import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBoardStore } from "@/shared/state/zustand.store";
import { UseMutateFunction } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster, toast } from "sonner";
import { X } from "lucide-react"
import { useSession } from "next-auth/react";
import { AddMemberMutationInput } from "@/features/member/hooks/member.hooks";

const AddMemberModal: React.FC<Props> = ({
  children,
  users,
  mutate,
  boardId,
  openModal,
  closeModal,
  boardMembers,
  isUsersLoading,
  isUsersFetching,
  isUsersError,
}) => {
  const {data:session} = useSession()
  const { memberName, setMemberName } = useBoardStore();
  const user = session?.user;
  const addMemberHandler = (selectedUser: UserProps) => {
    if (!selectedUser?.id) {
      toast.error("Selected user is invalid");
      return;
    }

    mutate({ boardId, userId: selectedUser.id, user: selectedUser });
  };
  const addableUsers = useMemo(
    () =>
      users
        ?.filter((usr) => usr?.email !== user?.email)
        .filter(
          (usr) => !boardMembers?.some((member) => member?.User?.id === usr?.id)
        ),
    [users, user, boardMembers]
  );
  const visibleUsers = useMemo(() => {
    const search = memberName.trim().toLowerCase();
    if (!search) {
      return addableUsers;
    }

    return addableUsers.filter((usr) => {
      const name = (usr?.name ?? "").toLowerCase();
      const email = (usr?.email ?? "").toLowerCase();
      return name.includes(search) || email.includes(search);
    });
  }, [addableUsers, memberName]);
  const handleOpenChange = (isOpen: boolean) => {
    closeModal(isOpen);
    if (!isOpen) {
      setMemberName("");
    }
  };
  return (
    <>
    <Toaster richColors position="top-center" />
    <Dialog open={openModal} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:bg-gray-700 max-h-[90vh] overflow-y-scroll">
        <DialogHeader className="flex justify-between items-center my-3">
          <X className="h-5 w-5 ml-auto mb-1 cursor-pointer" onClick={() => handleOpenChange(false)} />
          <DialogTitle className="font-rubik">Add Member</DialogTitle>
          
        </DialogHeader>
        <section className="flex items-center">
          <Input
            placeholder="Enter member name"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
          {/* // <Button>Search</Button> */}
        </section>
        <section className="flex flex-col">
          {isUsersLoading || isUsersFetching ? (
            <p className="text-xs text-muted-foreground px-2 py-3">
              Searching users...
            </p>
          ) : isUsersError ? (
            <p className="text-xs text-red-500 px-2 py-3">
              Failed to load users. Please try again.
            </p>
          ) : visibleUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-3">
              {memberName.trim()
                ? "No users matched your search."
                : "No available users to add."}
            </p>
          ) : (
            visibleUsers.map((usr) => (
              <Button variant={'ghost'} className="flex items-center justify-start gap-2" key={usr?.id}
                onClick={()=>{
                  addMemberHandler(usr)
                  toast.success("Member has been added")
                  handleOpenChange(false)
                }}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={usr?.image!} alt={usr?.name!} />
                  <AvatarFallback>{usr?.name}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{usr?.name}</span>
              </Button>
            ))
          )}
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
  mutate: UseMutateFunction<
    unknown,
    unknown,
    AddMemberMutationInput,
    {
      previousMembers: unknown;
    }
  >;
  boardId:string,
  openModal:boolean,
  closeModal:(bol:boolean)=>void,
  boardMembers:Array<MemberProps>,
  isUsersLoading: boolean,
  isUsersFetching: boolean,
  isUsersError: boolean
}
