import InputFieldSk from "../skeleton/InputFieldSk";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React from "react";

const BoardInfo = ({
  connection,
  label,
  value,
  onChange,
  disabled,
  isLoading,
}: Props) => {
  return (
    <section>
      {isLoading ? (
        <section className="flex flex-col gap-2">
          <InputFieldSk className="h-4 w-[80px]"/>
          <InputFieldSk/>
        </section>
      ) : (
        <section className="flex flex-col gap-2">
          <Label htmlFor={connection} className="text-xs sm:text-base font-semibold">
            {label}
          </Label>
          <Input
            id={connection}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="text-xs sm:text-base"
          />
        </section>
      )}
    </section>
  );
};

export default BoardInfo;

interface Props {
  connection: string;
  label: string;
  value: string;
  onChange: () => void;
  disabled: boolean;
  isLoading: boolean;
}
