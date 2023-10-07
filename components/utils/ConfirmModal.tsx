"use client";
import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const ConfirmModal = ({
  children,
  open,
  title,
  desc,
  btnText,
  onCloseModal,
  confrimHandler
}: Props) => {
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95%] mx-auto sm:max-w-[23rem] dark:bg-gray-700">
        <DialogHeader>
          <DialogTitle>
            <p className="text-left text-sm sm:text-base">{title}</p>
          </DialogTitle>
          <DialogDescription>
            <p className="my-2 text-left text-xs sm:text-base"> {desc}</p>
            {/* Are you sure want to delete board?If you delete your board , you
            will permanently lose your board data. */}
          </DialogDescription>
        </DialogHeader>
        <section className="flex justify-end gap-3">
          <Button
            variant={"ghost"}
            className="font-semibold text-xs sm:text-sm"
            onClick={onCloseModal}
          >
            Cancel
          </Button>
          <Button className="bg-red-500 text-white hover:bg-red-600 font-semibold text-xs sm:text-base h-8 sm:h-9"
            onClick={confrimHandler}
          >
            {btnText}
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ConfirmModal);

interface Props {
  children: React.ReactNode;
  open: boolean;
  title: string;
  desc: string;
  btnText: string;
  onCloseModal: () => void;
  confrimHandler: () => void;
}
