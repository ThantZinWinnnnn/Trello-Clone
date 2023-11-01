"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

//icon
import { AlertCircle, CheckSquare, Bookmark } from "lucide-react";
import { TrashIcon } from "@radix-ui/react-icons";
import { Label } from "../ui/label";

//components
import StatusDropdown from "../Issue/StatusDropdown";
import Member from "../utils/Member";

//data
import { issueType, piorityArr } from "../DummyData/data";
import AddMemberButton from "../members/AddMoreButton";
import SearchMember from "../utils/SearchMember";

import { useIssueTypeAndPriorityFun } from "../DndComponents/TodoCard";
import { useSession } from "next-auth/react";
import CreateComment from "../comment/CreateComment";
import Comments from "../comment/Comments";
import { useGetLists } from "@/lib/hooks/list.hooks";
import { useParams } from "next/navigation";
import { formatDate } from "../utils/util";
import { useUpdateAssignee, useDeleteIssue } from "@/lib/hooks/issue.hooks";
import IssueDetailPiority from "../Issue/IssueDetailPiority";
import { useBoardStore } from "@/globalState/store/zustand.store";
import { useGetMembers } from "@/lib/hooks/member.hooks";
import ReadOnlyRichText from "../Issue/ReadOnlyRichText";

const IssueDetailComponent = ({
  children,
  issue,
  listId,
  indx,
}: {
  children: React.ReactNode;
  issue: DndIssueProps;
  listId: string;
  indx: number;
}) => {
  const { data: session } = useSession();
  const { user, issueUpdateType } = useBoardStore();
  const param = useParams();
  const { data: lists } = useGetLists(param.boardId as string);
  const { mutate: updateAssignee } = useUpdateAssignee(
    issue?.id as string,
    listId,
    user!,
    param.boardId as string,
    issueUpdateType
  );
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useGetMembers(param.boardId as string);
  const { mutate: deleteIssue } = useDeleteIssue(
    param?.boardId as string,
    listId
  );
  const [openSearchInput, setOpenSearchInput] = useState<Boolean>(false);
  const [liStatus, setLiStatus] = useState<string>(
    filterStatusType(listId, lists!)
  );
  const [priority, setPriority] = useState(issue?.priority);
  const [nListId, setNListId] = useState("");
  const openSearchInputHandler = () => setOpenSearchInput((prev) => !prev);
  const issueCategory = useIssueTypeAndPriorityFun(
    piorityArr,
    issueType,
    issue
  );
  const status = filterStatusType(listId, lists!);
  const reporter = useMemo(
    () => users?.find((usr) => usr?.User?.id === issue?.reporterId)?.User,
    [issue?.reporterId, users]
  );
  const toBeAssignees = useMemo(
    () => users?.filter((ass) => ass?.User?.id !== reporter?.id),
    [reporter?.id, users]
  );

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[1050px] focus-visible:border-none  dark:bg-gray-700 h-[95vh] sm:h-auto overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-center">Issue Detail</DialogTitle>
        </DialogHeader>
        <section>
          <section>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <issueCategory.Icon
                  className={`w-5 h-5 p-1 rounded-sm text-white ${issueCategory?.issueCat?.color}`}
                />
                <span>{issueCategory.issueCat?.text}</span>
              </div>
              <Button
                variant={"ghost"}
                className="flex items-center gap-2 group bg-red-500 hover:bg-red-600 !py-1 h-8 sm:h-9"
                onClick={() => deleteIssue(issue?.id as string)}
              >
                <TrashIcon className="w-4 h-4 text-white" />
                <span className="text-[0.72rem] uppercase font-semibold  text-white">
                  delete
                </span>
              </Button>
            </div>
            <section className="flex flex-col-reverse sm:!flex-row gap-4 overflow-y-scroll">
              <section className="w-full sm:w-[65%]">
                <h2 className="text-lg font-semibold mt-4">{issue?.summary}</h2>

                {/* desc */}
                <div className="flex flex-col gap-2 mt-6 w-[90%]">
                  <Label htmlFor="desc" className="text-xs">
                    Description
                  </Label>
                  {/* <p
                    id="desc"
                    className="text-base font-semibold tracking-wide leading-6"
                  >
                    {issue?.desc}
                  </p> */}
                  <ReadOnlyRichText description={issue?.desc}/>
                </div>

                <section className="flex flex-col gap-6">
                  <section>
                    <h2 className="text-xs font-medium mt-9 mb-4">Comments</h2>
                    <CreateComment session={session!} issueId={issue?.id} />
                  </section>
                  <Comments issueId={issue?.id} />
                </section>
              </section>
              <section className="w-full sm:w-[35%] flex flex-col gap-6">
                <div>
                  <Label className="uppercase text-sm">Lists</Label>
                  <StatusDropdown
                    lists={lists!}
                    status={status}
                    issue={issue}
                    oIndx={indx}
                    setNListId={setNListId}
                    liStatus={liStatus}
                    setLiStatus={setLiStatus}
                  />
                </div>
                <div className="w-[140px]">
                  <Label className="uppercase text-xs">reporter</Label>
                  <Member
                    user={reporter!}
                    updateAssignee={updateAssignee}
                    boardId={param?.boardId as string}
                    reporter={true}
                  />
                </div>
                <div className="relative w-full">
                  <Label className="uppercase text-xs">assignees</Label>
                  <div className="flex items-center flex-wrap gap-2 w-full">
                    {issue?.assignees?.map((usr) => (
                      <Member
                        key={usr?.id}
                        user={usr?.User}
                        updateAssignee={updateAssignee}
                        boardId={param.boardId as string}
                        reporter={false}
                      />
                    ))}
                    <AddMemberButton handler={openSearchInputHandler}/>
                    {openSearchInput && (
                      <SearchMember
                        closeSearchHandler={openSearchInputHandler}
                        users={toBeAssignees!}
                        updateAssignee={updateAssignee}
                        boardId={param.boardId as string}
                        assignees={issue?.assignees!}
                      />
                    )}
                  </div>
                </div>
                <div className="w-[200px]">
                  <Label className="uppercase text-xs">priority</Label>
                  <IssueDetailPiority
                    val={priority}
                    setPriority={setPriority}
                    updatePriority={updateAssignee}
                    boardId={param?.boardId as string}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Created - <span>{formatDate(issue?.createdAt!)}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Updated - {formatDate(issue?.updatedAt!)}
                </p>
              </section>
            </section>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default memo(IssueDetailComponent);

const filterStatusType = (type: string, lists: Array<ListProps>) => {
  const status = lists.find((li) => li.id === type);
  return status?.name!;
};
