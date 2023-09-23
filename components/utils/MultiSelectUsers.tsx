"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { I } from "../Issue/CreateIssue";


const MultiSelectUsers: React.FC<MultiSelectUsersProps> = function ({
  users,
  isLoading,
  val = [],
  dispatch,
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Array<MemberProps> | undefined>(val);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (user: UserProps) => {
      setSelected((prev) =>
        prev?.filter(
          (u) => u.User?.id !== selected?.find((usr) => usr.User?.id === user.id)?.User?.id
        )
      );
    },
    [selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev!];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = users?.filter((usr) => !selected?.includes(usr));
  const assigneesArr = selected?.map((usr)=>usr?.User.id)

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
      onValueChange={(val)=> console.log("multi",val)}
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected?.map((usr) => {
            return (
              <Badge key={usr.User?.id} variant="secondary">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={usr?.User?.image!} alt={usr.User?.name!} />
                    <AvatarFallback>{usr?.User?.name}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{usr?.User?.name}</span>
                </div>
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(usr?.User);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(usr?.User)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select users..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables?.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                users?.map((user) => {
                  return (
                    <CommandItem
                      key={user.User?.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev!, user]);
                        dispatch({type:"assignee",value:[...assigneesArr!,user?.User?.id] as string[]})
                      }}
                      className={"cursor-pointer"}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user?.User?.image!} alt={user.User?.name!} />
                          <AvatarFallback>{user?.User?.name}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">
                          {user?.User?.name}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
};

export default React.memo(MultiSelectUsers);
interface MultiSelectUsersProps {
  users: Array<MemberProps>;
  isLoading?: boolean;
  val: Array<MemberProps> | undefined;
  dispatch: React.Dispatch<I>;
}
