interface CreateFirstBoardProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
interface InputBoardProps{
    name:string,
    userId:string | null | undefined
}

interface BoardProps{
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface GetUserBoardsProps{
  boards: BoardProps[];
}

interface CreateBoardProps{
  name:string,
  setName:(name:string)=> void;
  createBoardHandler:(inputName: string, userId: string | undefined | null) => void,
  isLoading:boolean,
  ClassName?:string,
}