import React, { Dispatch, memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { I } from "../Issue/CreateIssue";
import { UseMutateFunction } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const DropdownUsers: React.FC<DropdownUserProps> = ({
  users,
  isLoading,
  dispatch,

}) => {
  const params = useParams()
  const [filterUser, setFilterUser] = useState<string>("");
  const filteredUsers =
    filterUser !== ""
      ? users?.filter((user) =>
          user?.User?.name!.toLowerCase().includes(filterUser.toLowerCase())
        )
      : users;

  return (
    <Select onValueChange={(val)=>dispatch({type:"reporter",value:val})  
    }>
      <SelectTrigger>
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent className="dark:bg-gray-700">
        <SelectGroup>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Input
                placeholder="search..."
                value={filterUser}
                className="focus:border-none border-none mb-1 dark:bg-gray-500"
                onChange={(e) => setFilterUser(e.target.value)}
              />
              {filteredUsers?.map((user) => (
                <SelectItem
                  className="flex items-center"
                  key={user?.User?.id}
                  value={user?.User?.id!}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.User?.image!} alt={user?.User?.name!} />
                      <AvatarFallback>{user?.User?.name}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{user?.User?.name}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default memo(DropdownUsers);

interface DropdownUserProps {
  users: Array<MemberProps> | undefined;
  multiple?: boolean;
  isLoading?: boolean;
  val:string,
  dispatch:Dispatch<I>,
}
