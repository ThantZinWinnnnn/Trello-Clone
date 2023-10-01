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

interface DetailBoardProps extends BoardProps{
  User:UserProps,
  members:Array<BoardMemberProps>
}

interface GetUserBoardsProps {
  createdBoards: {boards:Array<BoardProps>},
  assignedBoards:Array<BoardProps>
}
type inputProps = {
  inputName:string,
  userId:string | undefined | null
}
interface CreateBoardProps {
  name: string;
  setName: (name: string) => void;
  createBoardHandler: (
    data:inputProps
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
  order: number;
  createdAt: string;
  updatedAt: string;
  boardId: string;
}

interface GetListsProps {
  lists: ListProps[];
}

interface UserProps {
  id: string |null;
  name: string | null;
  email: string | null;
  emailVerified?: null | undefined | Date;
  image: string | null;
};
type ProfileUserProps = Partial<UserProps> 

interface MemberProps{
  id:string | null,
  isAdmin:boolean | null,
  createdAt:string | null,
  User:UserProps
}

interface BoardMemberProps{
  id:string | null,
  isAdmin:boolean | null,
  boardId:string,
  createdAt:string | null,
  userId:string,
  User:UserProps,
}

type OptimisticUser = Partial<UserProps>

interface AssigneeProps {
  id: string;
  createdAt: string;
  userId: string;
  issueId: string;
  boardId: string;
  User: UserProps;
}

interface IssueUpdateProps{
  type:string,
  value:string,
  boardId:string,
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
  assignees: Array<AssigneeProps>;
  createdAt?: string;
  updatedAt?: string;
}
interface Issues{
  [key:string] : Array<DndIssueProps>;
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
    dId: string;
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

interface GetDataProps{
  boardId:string,
  queryKey:string,
  T : typeof Array<ListProps> | Issues
}

interface orderProps {
  id: string;
  oIdx: number;
  nIdx: number;
  boardId?:string
}

interface PiorityArrProps{
  value:string,
  icon:ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>,
  color:string
}

interface CreateComment{
  desc:string ,
  issueId:string,
  userId:string ,
  id?:string ,
  createdAt?:string 
  User?:OptimisticUser
}

type UpdateComment = {
  desc:string,
  commentId:string
};

type DeleteComment = {
  commentId:string
}

type OptimisticCreateComment = Partial<CreateComment>

interface CommentProps{
  id:string | undefined,
  desc:string | undefined,
  issueId:string | undefined,
  userId:string | undefined,
  createdAt:string | undefined,
  User:OptimisticUser 
}

interface AddMember{
  boardId:string,
  userId:string
}

interface RemoveMember extends AddMember {
  memberId:string
};

type AddMembersArr = {
  members:Array<AddMember>
}

interface UpdateListName {
  listId:string,
  name:string
}

