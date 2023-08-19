import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps{
    boards:BoardProps[]
}

const initialState:InitialStateProps = {
    boards:[]
};

const boardSlice = createSlice({
    initialState,
    name:'boardSlice',
    reducers:{
        addBoardsData:(state,action:PayloadAction<BoardProps[]>)=>{
            state.boards = action.payload;
        }
    }
}   
);

export const {addBoardsData} = boardSlice.actions;
export default boardSlice.reducer;