import React from "react";
import DropdownUsers from "../utils/DropdownUser";
import { useGetUsersQuery } from "@/redux/apis/endpoints/users.endpoint";
import { toast,Toaster } from "sonner";

const ReporterDropdown = () => {
    const { data : users, isLoading, isError, error } = useGetUsersQuery();
    if(isError) toast.error("Error fetching users")

  return(
    <>
    <Toaster richColors position="top-center"/>
    <DropdownUsers  users={users} multiple={false} isLoading={isLoading}/>
    </>
  )
};

export default ReporterDropdown;
