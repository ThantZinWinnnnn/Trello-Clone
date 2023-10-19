
//   ------------------ - - - - isssue utility functions- - - - ---------------------
export const updateIssueOrderLocally = (issues: Issues, { s, d }: dndOrderProps) => {
    const source = issues[s.sId].slice(0);
    const target = issues[d.dId].slice(0);
    const draggedIssue = source.splice(s.oIdx, 1)[0]; // remove dragged item from its source list
    (s.sId === d.dId ? source : target).splice(d.nIdx, 0, draggedIssue); // insert dragged item into target list
    return { ...issues, [d.dId]: target, [s.sId]: source } as Issues;
  };

export const updateListStatusLocally = (
    issues: Issues,
    oldListId: string,
    newListId: string,
    issueId: string
  ) => {
    const source = issues[oldListId]?.slice(0);
    const target = issues[newListId]?.slice(0);
    const changedIssueIdx =
      source?.find((issue) => issue?.id === issueId)?.order! - 1;
    const changedIssue = source?.splice(changedIssueIdx, 1)[0];
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
    const issue = source?.find((issue) => issue?.id === issueId);
    const sourceIssueIdx =
      source?.find((issue) => issue?.id === issueId)?.order! - 1;
    const tobeUpdatedIssue = source?.splice(sourceIssueIdx, 1)[0];
  
    const removeAssignIndx = tobeUpdatedIssue?.assignees?.findIndex(
      (assignee) => assignee?.User?.id === user?.id
    );
    const indx = tobeUpdatedIssue?.assignees?.length;
    type == "add"
      ? tobeUpdatedIssue?.assignees?.splice(indx!, 0, {
          id: value,
          createdAt: "",
          userId: user?.id!,
          issueId,
          boardId,
          User: user,
        })
      : type == "remove"
      ? tobeUpdatedIssue?.assignees?.splice(removeAssignIndx!, 1)
      : null;
  
    return { ...issues, [listId]: [...source, tobeUpdatedIssue] } as Issues;
  };

 export const deleteIssueLocally = (
    issues: Issues,
    listId: string,
    issueId: string
  ) => {
    const source = issues[listId]?.slice(0);
    const toBeDeletedIndx = source?.findIndex((issue) => issue?.id === issueId);
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
  }
