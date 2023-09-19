import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps {
    boards: BoardProps[],
    successBoardCreation: "success" | "failed" | "",
    lists: Array<List>,
    issues: Array<DndIssueProps>,
    filterUsrId: string,
    changedListId: string,
    issueLength: number
}

const initialState: InitialStateProps = {
    boards: [],
    successBoardCreation: "",
    lists: [],
    issues: [],
    filterUsrId: "",
    changedListId: "",
    issueLength:0
};

const boardSlice = createSlice({
    initialState,
    name: 'boardSlice',
    reducers: {
        addBoardsData: (state, action: PayloadAction<BoardProps[]>) => {
            state.boards = action.payload;
        },
        changeCreationBoardStatus: (state, action: PayloadAction<"success" | "failed" | "">) => {
            state.successBoardCreation = action.payload;
        },
        addListsData: (state, action: PayloadAction<List[]>) => {
            state.lists = action.payload;
        },
        addIssueData: (state, action: PayloadAction<DndIssueProps[]>) => {
            state.issues = action.payload;
        },
        addFilterUsrId: (state, action: PayloadAction<string>) => {
            state.filterUsrId = action.payload
        },
        changeListId: (state, action: PayloadAction<string>) => {
            state.changedListId = action.payload
        },
        addIssueLength: (state, action: PayloadAction<number>) => {
            state.issueLength = action.payload
        }
    }
}
);

export const { addBoardsData, changeCreationBoardStatus, addListsData, addIssueData, addFilterUsrId,changeListId ,addIssueLength} = boardSlice.actions;
export default boardSlice.reducer;