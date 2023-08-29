import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleAuthenticateButton from "./GoogleAuthenticateButton";
import { Label } from "../ui/label";

const Authenticate = () => {
  return (
    <form className="bg-white rounded-lg px-6 py-8 shadow-lg">
      <div className="flex flex-col gap-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email" className="mb-1">Username</Label>
          <Input type="email" id="email" placeholder="username" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email" className="mb-1">Email</Label>
          <Input type="email" id="email" placeholder="example@gmail.com" />
        </div>
      </div>
      <Button className="mt-10 w-full">Sign In</Button>
      <div className="mx-auto my-10 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleAuthenticateButton />
    </form>
  );
};

export default Authenticate;
