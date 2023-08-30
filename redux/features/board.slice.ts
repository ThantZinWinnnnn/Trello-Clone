import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps{
    boards:BoardProps[],
    successBoardCreation:"success"|"failed" | "",
    lists:Array<List>,
    issues:Array<DndIssueProps>,
    filterUsrId:string,
}

const initialState:InitialStateProps = {
    boards:[],
    successBoardCreation:"",
    lists:[],
    issues:[],
    filterUsrId:""
};

const boardSlice = createSlice({
    initialState,
    name:'boardSlice',
    reducers:{
        addBoardsData:(state,action:PayloadAction<BoardProps[]>)=>{
            state.boards = action.payload;
        },
        changeCreationBoardStatus:(state,action:PayloadAction<"success"|"failed"| "">)=>{
            state.successBoardCreation = action.payload;
        },
        addListsData:(state,action:PayloadAction<List[]>)=>{
            state.lists = action.payload;
        },
        addIssueData :(state,action:PayloadAction<DndIssueProps[]>)=>{
            state.issues = action.payload;
        },
        addFilterUsrId:(state,action:PayloadAction<string>)=>{
            state.filterUsrId = action.payload
        }
    }
}   
);

export const {addBoardsData,changeCreationBoardStatus,addListsData,addIssueData,addFilterUsrId} = boardSlice.actions;
export default boardSlice.reducer;