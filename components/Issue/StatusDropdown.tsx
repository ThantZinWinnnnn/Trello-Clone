import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { useReorderLists } from "@/lib/hooks/useReorderLists";
import { useChangeListStatus } from "@/lib/hooks/issue.hooks";

const StatusDropdown = ({
  lists,
  status,
  issue,
}: {
  lists: Array<ListProps>;
  status: string;
  issue: DndIssueProps;
}) => {
  const param = useParams();
  const [liStatus, setLiStatus] = useState<string>(status);
  const [nListId,setNListId] = useState("")
  const oIdx = useMemo(
    () => lists.findIndex((li) => li.name === status),
    [status]
  );
  const nIdx = useMemo(
    () => lists.findIndex((li) => li.name === liStatus),
    [liStatus]
  );
  const oldListId = useMemo(
    () => lists.find((li) => li.name === status)?.id!,
    [status]
  );
  const boardId = param.boardId as string;
  const newListId = useMemo(
    () => lists.find((li) => li.name === liStatus)?.id!,
    [liStatus]
  );
  // const newListId = lists.find((li) => li.name === liStatus)?.id! as string;
  const issueId = issue?.id;
  const assigneessArr = issue?.assignees.map((assignee) => assignee.User?.id!)
  const data:IssueState = {
    image:issue?.image,
    type:issue?.type,
    summary:issue?.summary,
    desc:issue?.desc,
    priority:issue?.priority,
    reporterId:issue?.reporterId,
    assignees:assigneessArr,
    boardId,
    listId:""
  }

  const { mutate: changeIssueStatus } = useChangeListStatus(
    boardId,
    oldListId,
    nListId,
    issueId
  );

  const optimisticListChange=useCallback(()=>{
    console.log("liiiiiiiiiiiiiiiiiiii",{...data,listId:newListId})
  },[newListId])
  console.log(
    "statatat",
    status,
    "oldI",
    oIdx,
    "nI",
    nIdx,
    "listId",
    oldListId,
    "newListId",
    nListId,
    "issueId",
    issueId,
    "issueBody",
    data
  );

  const changeStatusFun =  (val: string) => {
    const newListIdd =lists.find((li) => li.name === val)?.id!;
    setNListId(newListIdd)
    setLiStatus(val);
    changeIssueStatus({...data,listId:newListIdd});
    // optimisticListChange()
    
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
