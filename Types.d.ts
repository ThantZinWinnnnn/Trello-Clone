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
  image: string;
  type: string;
  summary: string;
  desc: string;
  priority: string;
  reporterId: string;
  listId: string;
  assignees: Array<AssigneeProps>;
}

interface DndListsProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  boardId: string;
  issues: Array<DndIssueProps>;
}

interface ReturnDndListsProps {
  lists: Array<DndListsProps>;
}
