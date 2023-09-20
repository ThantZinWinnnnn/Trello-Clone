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
import { useAppDispatch, useAppSelector } from "@/redux/store/hook";
import { changeListId } from "@/redux/features/board.slice";
import { useReorderIssues } from "@/lib/hooks/custom.borad.hooks";

const StatusDropdown = ({
  lists,
  status,
  issue,
  oIndx,
  setNListId,
  liStatus,
  setLiStatus,
  newListId
}: {
  lists: Array<ListProps>;
  status: string;
  issue: DndIssueProps;
  oIndx:number,
  setNListId:React.Dispatch<React.SetStateAction<string>>,
  liStatus:string,
  setLiStatus:React.Dispatch<React.SetStateAction<string>>,
  newListId:string
}) => {
  const param = useParams();
  const dispatch = useAppDispatch();
  const oldListId = useMemo(
    () => lists.find((li) => li.name === status)?.id!,
    [status, lists]
  );
  const boardId = param.boardId as string;
  const issueId = issue?.id;
 
  const { mutate: changeIssueStatus } = useChangeListStatus(
    boardId,
    oldListId,
    newListId,
    issueId
  );
  const changeStatusFun = (val: string) => {
    const newListIdd = lists.find((li) => li.name === val)?.id!;
    setNListId(newListIdd);
    dispatch(changeListId(newListIdd))
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
