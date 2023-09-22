import {create} from "zustand";

interface BoardState{
    issueName :string,
    setIssueName:(val:string)=>void,
    memberId:string,
    setMemberId:(id:string)=>void,
    changedListId:string,
    setChangedListId:(listId:string)=>void,
    user:UserProps | null,
    setUser:(usr:UserProps)=>void,
    issueUpdateType:"add" | "remove" | "priority" | "",
    setIssueUpdateType:(type:"add" | "remove" | "priority" | "")=>void,
    successBoardCreation:"success" | "failed" | "",
    setSuccessBoardCreation:(type:"success" | "failed" | "")=>void,
    boards:BoardProps[],
    setBoards:(boards:BoardProps[])=>void
};

export const useBoardStore = create<BoardState>()((set)=>({
    issueName:"",
    memberId:"",
    changedListId:"",
    user:null,
    issueUpdateType:"",
    successBoardCreation:"",
    boards:[],
    setIssueName:(val:string)=>set(({issueName:val})),
    setMemberId:(id:string)=>set(({memberId:id})),
    setChangedListId:(listId:string)=>set(({changedListId:listId})),
    setUser:((usr:UserProps)=>set(({user:usr}))),
    setIssueUpdateType:((type:"add" | "remove" | "priority" | "")=>set(({issueUpdateType:type}))),
    setSuccessBoardCreation:((type:"success" | "failed" | "")=>set(({successBoardCreation:type}))),
    setBoards:((boards:BoardProps[])=>set(({boards:boards})))
}))