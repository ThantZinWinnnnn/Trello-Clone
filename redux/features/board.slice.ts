import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps{
    boards:BoardProps[],
    successBoardCreation:"success"|"failed" | ""
}

const initialState:InitialStateProps = {
    boards:[],
    successBoardCreation:""
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
        }
    }
}   
);

export const {addBoardsData,changeCreationBoardStatus} = boardSlice.actions;
export default boardSlice.reducer;