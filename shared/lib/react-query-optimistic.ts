
//   ------------------ - - - - isssue utility functions- - - - ---------------------
export const updateIssueOrderLocally = (
  issues: Issues | undefined,
  { s, d }: dndOrderProps
) => {
  if (!issues) {
    return issues;
  }

  const source = issues[s.sId]?.slice(0) ?? [];
  const target = issues[d.dId]?.slice(0) ?? [];
  const draggedIssue = source[s.oIdx];

  if (!draggedIssue) {
    return issues;
  }

  source.splice(s.oIdx, 1);
  const destination = s.sId === d.dId ? source : target;
  destination.splice(d.nIdx, 0, draggedIssue);

  return { ...issues, [s.sId]: source, [d.dId]: destination } as Issues;
};

export const updateListStatusLocally = (
    issues: Issues,
    oldListId: string,
    newListId: string,
    issueId: string
  ) => {
    const source = issues[oldListId]?.slice(0);
    const target = issues[newListId]?.slice(0);

    const changedIssueIdx = source?.findIndex((issue) => issue?.id === issueId) ?? -1;
    if (changedIssueIdx < 0) {
      return issues;
    }

    const changedIssue = source?.splice(changedIssueIdx, 1)[0];
    if (!changedIssue) {
      return issues;
    }

    target?.splice(target?.length, 0, changedIssue);
    return { ...issues, [oldListId]: source, [newListId]: target } as Issues;
  };

export const updateAssigneeLocally = (
    issues: Issues,
    issueId: string,
    listId: string,
    user: UserProps,
    value: string,
    boardId: string,
    type: string
  ) => {
    const source = issues[listId]?.slice(0);
    const sourceIssueIdx = source?.findIndex((issue) => issue?.id === issueId) ?? -1;
    if (sourceIssueIdx < 0) {
      return issues;
    }

    const tobeUpdatedIssue = source?.splice(sourceIssueIdx, 1)[0];
    if (!tobeUpdatedIssue) {
      return issues;
    }
  
    const removeAssignIndx = tobeUpdatedIssue?.assignees?.findIndex(
      (assignee) => assignee?.User?.id === user?.id
    );
    const indx = tobeUpdatedIssue?.assignees?.length;
    type === "add"
      ? tobeUpdatedIssue?.assignees?.splice(indx!, 0, {
          id: value,
          createdAt: "",
          userId: user?.id!,
          issueId,
          boardId,
          User: user,
        })
      : type === "remove" && removeAssignIndx !== undefined && removeAssignIndx > -1
      ? tobeUpdatedIssue?.assignees?.splice(removeAssignIndx, 1)
      : null;

    source?.splice(sourceIssueIdx, 0, tobeUpdatedIssue);
  
    return { ...issues, [listId]: source } as Issues;
  };

 export const deleteIssueLocally = (
    issues: Issues,
    listId: string,
    issueId: string
  ) => {
    const source = issues[listId]?.slice(0);
    const toBeDeletedIndx = source?.findIndex((issue) => issue?.id === issueId);
    if (toBeDeletedIndx === undefined || toBeDeletedIndx < 0) {
      return issues;
    }
    source?.splice(toBeDeletedIndx!, 1);
    return { ...issues, [listId]: source } as Issues;
  };

//   ------------------ - - - - Lists utility functions- - - - ---------------------

export const updateListOrderLocally = (lists: Array<ListProps>,{id,oIdx,nIdx}:orderProps ) => {
    const sourceList = lists.slice(0);
    const draggedList = sourceList.splice(oIdx, 1)[0];
    sourceList.splice(nIdx, 0, draggedList);

    return sourceList;
}

//   ------------------ - - - - board utility functions- - - - ---------------------

export const deleteBoardLocally = (oldUserBoards: GetUserBoardsProps, boardId: string,action:"remove" | "leave") => {
    const oldCreatedBoards = oldUserBoards?.createdBoards;
    const oldAssignedBoards = oldUserBoards?.assignedBoards;
    const updatedDeletedBoards = oldCreatedBoards?.boards?.filter((board) => board?.id !== boardId);
    const updatedLeavedBoards = oldAssignedBoards?.filter((board) => board?.id !== boardId);
    if(action === "remove"){
      return {
          createdBoards:{
              boards:updatedDeletedBoards
          },
          assignedBoards:oldAssignedBoards
      } as GetUserBoardsProps
     }else if(action === "leave"){
     return {
          createdBoards:oldCreatedBoards,
          assignedBoards:updatedLeavedBoards
         } as GetUserBoardsProps
     }
     return oldUserBoards;
  }
