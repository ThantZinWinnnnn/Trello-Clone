import React, { Dispatch } from "react";
import { Textarea } from "../ui/textarea";
import { I } from "./CreateIssue";

const DescTextArea = ({ value, dispatch }: Props) => {
  return (
    <Textarea
      placeholder="Type your issue Description  here."
      id="description"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: "desc", value: e.target.value });
      }}
      className="dark:bg-gray-500"
    />
  );
};

export default DescTextArea;
type Props = {
  value: string;
  dispatch: Dispatch<I>;
};
