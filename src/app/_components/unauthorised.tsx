"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { LuLogOut } from "react-icons/lu";

export default function Unauthorised() {
  const { data: session } = useSession();
  return (
    <Card className="mx-4 bg-blue-700/10 backdrop-blur-md shadow-2xl shadow-black/20 text-white">
      <CardHeader>
        <CardTitle>Not Authorized</CardTitle>
        <CardDescription>Error 401</CardDescription>
      </CardHeader>
      <CardContent className="flex max-w-prose flex-col gap-3">
        <div>
          Existing students and other engineering students are requested to
          register from <a href="incridea.in">incridea.in</a>
        </div>
        <div>
          {/* TODO: Add details */}
          If you think this is an error, contact the developers
        </div>
        <div>
          You are currently signed in as{" "}
          <span className="font-bold">{session?.user.name}</span> (
          <span className="font-bold">{session?.user.email}</span>) through
          Google.
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            await signOut();
          }}
          className="bg-white text-black hover:scale-105 hover:bg-white hover:text-palate_2"
        >
          <LuLogOut className="mr-2 size-5" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}
