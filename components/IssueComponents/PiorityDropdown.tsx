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
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

//data
import { piorityArr } from "../DummyData/data";

const PiorityDrowdown: React.FC<PiorityDropdownProps> = ({ className }) => {
  return (
    <section>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Please Select piority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {piorityArr.map((pr, index) => (
              <SelectItem key={index} value={pr.value}>
                <div className="flex items-center gap-2">
                  <pr.icon className={`w-4 h-4 ${pr.color}`} />
                  <span className="text-xs font-medium">{pr.value}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-[0.7rem] mt-1">Piority in relation to other issues</p>
    </section>
  );
};

export default PiorityDrowdown;

interface PiorityDropdownProps {
  className?: string;
}
