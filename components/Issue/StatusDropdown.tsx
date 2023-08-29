import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatusDropdown = () => {
  return (
    <Select>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select status"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            {/* to add column array from bakend */}
            <SelectItem value="todo">todo</SelectItem>
            <SelectItem value="progress">progress</SelectItem>
            <SelectItem value="done">done</SelectItem>
            <SelectItem value="backlog">backlog</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusDropdown;
