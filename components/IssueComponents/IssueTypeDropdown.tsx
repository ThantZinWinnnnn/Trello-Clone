import React, { Dispatch } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//data
import { issueType } from "../DummyData/data";
import { I } from "./CreateIssue";

const IssueTypeDropdown:React.FC<IssueTypeDropdownProps> = ({val,dispatch}) => {

  return (
    <Select onValueChange={(val)=> dispatch({type:"type",value:val})} >
      <SelectTrigger>
        <SelectValue  placeholder="Select issue type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {issueType.map((type, index) => (
            <SelectItem
              key={index}
              value={type.text}
              className="flex items-center gap-1"
            >
              <div className="flex items-center gap-3">
                <type.icon
                  className={`${type.color} p-1 rounded-sm text-white`}
                />
                <span className="block">{type.text}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default IssueTypeDropdown;

interface IssueTypeDropdownProps{
  val:string,
  dispatch:Dispatch<I>
}
