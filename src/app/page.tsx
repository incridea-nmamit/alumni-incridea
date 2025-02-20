"use client";

import { useSession } from "next-auth/react";
import PleaseLogin from "./_components/pleaseLogin";
import Unauthorised from "./_components/unauthorised";
import Alumni from "../components/alumni";
import Admin from "../components/admin";
import Volunteer from "~/components/volunteer";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="flex min-h-screen items-center justify-center">
      {!session?.user ? (
        <PleaseLogin />
      ) : session.user.role === "ADMIN" ? (
        <Admin />
      ) : session.user.role === "VOLUNTEER" ? (
        <Volunteer />
      ) : session.user.email.endsWith("@nitte.edu.in") ||
        session.user.email.endsWith("@nmamit.in") ? (
        <Unauthorised />
      ) : (
        <Alumni />
      )}
    </div>
  );
}
