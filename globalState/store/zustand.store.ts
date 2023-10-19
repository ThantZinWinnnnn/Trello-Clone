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
    setBoards:(boards:BoardProps[])=>void,
    memberName:string,
    setMemberName:(val:string)=>void,
    member:UserProps | null,
    setMember:(usr:UserProps)=>void,
    currentDate:string,
    setCurrentDate:(date:string)=>void,
    profileUser:ProfileUserProps | null,
    setProfileUser:(usr:ProfileUserProps)=>void,
    boardName:string,
    setBoardName:(name:string)=>void,
    openSetting:boolean,
    setOpenSetting:(bool:boolean)=>void,
    reachedSetting:boolean,
    setReachedSetting:(bool:boolean)=>void,
    removeORLeaveBoard:"removed" | "leave" | "",
    setRemoveOrLeaveBoard:(status:"removed" | "leave")=>void,
    sort:string,
    setSort:(sort:string)=>void,
    assignee:UserProps | null,
    setAssignee:(usr:UserProps)=>void
};

export const useBoardStore = create<BoardState>()((set)=>({
    issueName:"",
    memberId:"",
    changedListId:"",
    user:null,
    issueUpdateType:"",
    successBoardCreation:"",
    boards:[],
    memberName:"",
    member:null,
    currentDate:"",
    profileUser:null,
    boardName:"",
    openSetting:false,
    reachedSetting:false,
    removeORLeaveBoard:"",
    sort:"alpha",
    assignee:null,
    setIssueName:(val:string)=>set(({issueName:val})),
    setMemberId:(id:string)=>set(({memberId:id})),
    setChangedListId:(listId:string)=>set(({changedListId:listId})),
    setUser:((usr:UserProps)=>set(({user:usr}))),
    setIssueUpdateType:((type:"add" | "remove" | "priority" | "")=>set(({issueUpdateType:type}))),
    setSuccessBoardCreation:((type:"success" | "failed" | "")=>set(({successBoardCreation:type}))),
    setBoards:((boards:BoardProps[])=>set(({boards:boards}))),
    setMemberName:((val:string)=>set(({memberName:val}))),
    setMember:((usr:UserProps)=>set(({member:usr}))),
    setCurrentDate:((date:string)=>set(({currentDate:date}))),
    setProfileUser:((usr:ProfileUserProps)=>set(({profileUser:usr}))),
    setBoardName:((name:string)=>set(({boardName:name}))),
    setOpenSetting:((bool:boolean)=>set(({openSetting:bool}))),
    setReachedSetting:((bool:boolean)=>set(({reachedSetting:bool}))),
    setRemoveOrLeaveBoard:((st:"removed" | "leave")=>set(({removeORLeaveBoard:st}))),
    setSort:((sort:string)=>set(({sort:sort}))),
    setAssignee:((usr:UserProps)=>set(({assignee:usr})))
}))