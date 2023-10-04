"use client"
import React, { memo,  useMemo} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { useChangeListStatus } from "@/lib/hooks/issue.hooks";
import { useBoardStore } from "@/globalState/store/zustand.store";

const StatusDropdown = ({
  lists,
  status,
  issue,
  oIndx,
  setNListId,
  liStatus,
  setLiStatus,
}: {
  lists: Array<ListProps>;
  status: string;
  issue: DndIssueProps;
  oIndx:number,
  setNListId:React.Dispatch<React.SetStateAction<string>>,
  liStatus:string,
  setLiStatus:React.Dispatch<React.SetStateAction<string>>,

}) => {
  const param = useParams();
  const {changedListId,setChangedListId} = useBoardStore();
  const oldListId = useMemo(
    () => lists.find((li) => li.name === status)?.id!,
    [status, lists]
  );
  const boardId = param.boardId as string;
  const issueId = issue?.id;
 
  const { mutate: changeIssueStatus } = useChangeListStatus(
    boardId,
    oldListId,
    changedListId,
    issueId
  );

  const changeStatusFun = (val: string) => {
    const newListIdd = lists.find((li) => li.name === val)?.id!;
    setNListId(newListIdd);
    setChangedListId(newListIdd)
    changeIssueStatus({type:"listId",value:newListIdd,boardId});
    setLiStatus(val);
  };

  return (
    <Select onValueChange={changeStatusFun} defaultValue={liStatus}>
      <SelectTrigger className="w-[150px]">
        <SelectValue defaultValue={liStatus} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {lists.map((li) => (
            <SelectItem key={li.id} value={li.name}>
              {li.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default memo(StatusDropdown);
