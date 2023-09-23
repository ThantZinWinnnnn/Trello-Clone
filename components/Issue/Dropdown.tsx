import React, { Dispatch, useCallback } from "react";
import DropdownUsers from "../utils/DropdownUser";

import { toast, Toaster } from "sonner";
import { I } from "./CreateIssue";
import MultiSelectUsers from "../utils/MultiSelectUsers";
import { useGetMembers } from "@/lib/hooks/member.hooks";
import { useParams, usePathname } from "next/navigation";

const Dropdown: React.FC<DropdownProps> = ({
  val,
  dispatch,
  arVal = [],
  multiple,
}) => {
  const params = useParams()
  const { data: members, isLoading, isError, error } = useGetMembers(params.boardId as string);
  if (isError) toast.error("Error fetching users");
  const dbUsr = useCallback(
    (strAr: Array<string>) => members?.filter((usr) => strAr?.includes(usr?.User?.id!)),
    [members]
  );
  if (multiple) {
    return (
      <MultiSelectUsers
        users={members!}
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
        users={members!}
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
