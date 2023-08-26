import React, { memo, useState } from "react";
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

const DropdownUsers: React.FC<DropdownUserProps> = ({
  users,
  multiple,
  isLoading,
}) => {
  const [filterUser, setFilterUser] = useState<string>("");
  const filteredUsers =
    filterUser !== ""
      ? users?.filter((user) =>
          user?.name.toLowerCase().includes(filterUser.toLowerCase())
        )
      : users;

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select people" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Input
                placeholder="search..."
                value={filterUser}
                className="focus:border-none border-none mb-1"
                onChange={(e) => setFilterUser(e.target.value)}
              />
              {filteredUsers?.map((user) => (
                <SelectItem
                  className="flex items-center"
                  key={user?.id}
                  value={user?.name}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.image} alt={user.name} />
                      <AvatarFallback>{user?.name}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{user?.name}</span>
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
  users: Array<UserProps> | undefined;
  multiple?: boolean;
  isLoading?: boolean;
}
