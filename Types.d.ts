interface CreateFirstBoardProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
interface InputBoardProps {
  name: string;
  userId: string | null | undefined;
}

interface BoardProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface GetUserBoardsProps {
  boards: BoardProps[];
}

interface CreateBoardProps {
  name: string;
  setName: (name: string) => void;
  createBoardHandler: (
    inputName: string,
    userId: string | undefined | null
  ) => void;
  isLoading: boolean;
  ClassName?: string;
}

interface CreateListProps {
  listName: string;
  boardId: string;
}

interface ListProps {
  id: string;
  order: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  boardId: string;
}

interface GetListsProps {
  lists: ListProps[];
}

interface UserProps {
  id: string;
  name: string;
  email: string;
  emailVerified?: null | undefined;
  image: string;
}

interface MembersProps{
  User:UserProps
}

interface AssigneeProps {
  id: string;
  createdAt: string;
  userId: string;
  issueId: string;
  boardId: string;
  User: UserProps;
}

interface DndIssueProps {
  id: string;
  order: number;
  image: string;
  type: string;
  summary: string;
  desc: string;
  priority: string;
  reporterId: string;
  listId: string;
  assignees: Array<MembersProps>;
  createdAt?: string;
  updatedAt?: string;
}

interface DndListsProps {
  id: string;
  order: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  boardId: string;
  issues: Array<DndIssueProps>;
}

interface Issues{
  [key:string] : Array<DndIssueProps>;
}

interface ReturnDndListsProps {
  lists: Array<DndListsProps>;
}

interface IssueState {
  image: string;
  type: string;
  summary: string;
  desc: string;
  priority: string;
  reporterId: string;
  assignees: Array<string>;
  boardId?: string;
  listId?: string;
}

interface MultiSelectUsers {
  users: Array<UserProps>;
  ref: HTMLInputElement;
  setUsers: React.Dispatch<React.SetStateAction<Array<UserProps>>>;
}

interface dndOrderProps {
  s: {
    sId: string;
    oIdx: number;
  };
  d: {
    dId: string | undefined;
    nIdx: number;
  };
}
interface ReorderIssue extends dndOrderProps {
  id: string;
  boardId?: string;
}

interface List {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  boardId: string;
}

interface DraggedIssueId{
  lists:Array<DndListsProps>;
  s:DraggableRubric.source,
  d:DraggableLocation | null | undefined
}


interface IssueProps{
  boardId: string;
  userId?:string
}
