import React, { Dispatch, useCallback } from "react";
import DropdownUsers from "../utils/DropdownUser";

import { toast, Toaster } from "sonner";
import { I } from "./CreateIssue";
import MultiSelectUsers from "../utils/MultiSelectUsers";
import { useGetUsers } from "@/lib/hooks/issue.hooks";

const Dropdown: React.FC<DropdownProps> = ({
  val,
  dispatch,
  arVal = [],
  multiple,
}) => {
  const { data: users, isLoading, isError, error } = useGetUsers();
  if (isError) toast.error("Error fetching users");
  const dbUsr = useCallback(
    (strAr: Array<string>) => users?.filter((usr) => strAr?.includes(usr.id!)),
    [users]
  );
  if (multiple) {
    return (
      <MultiSelectUsers
        users={users!}
        isLoading={isLoading}
        val={dbUsr(arVal)}
        dispatch={dispatch}
      />
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <DropdownUsers
        users={users}
        multiple={false}
        isLoading={isLoading}
        val={val!}
        dispatch={dispatch}
      />
    </>
  );
};

export default Dropdown;

interface DropdownProps {
  val?: string;
  dispatch: Dispatch<I>;
  arVal?: string[];
  multiple?: boolean;
}
