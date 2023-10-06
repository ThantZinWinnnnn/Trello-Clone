"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Authenticate = () => {
  const searchParams = useSearchParams();
  const callbackUrl = (searchParams.get("callbackUrl") as string) ?? "/boards";
  return (
    <Card className="w-[18.75rem] shadow-md dark:bg-gray-700">
      <CardHeader>
        <CardTitle className="text-base">Welcome to My Trello 🔥!</CardTitle>
        <CardDescription className="text-sm text-slate-400">
          Welcome to my minimalist project management Trello. Let&apos;s begin
          by logging in below.!!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm mt-2"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Sign In with Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default Authenticate;
