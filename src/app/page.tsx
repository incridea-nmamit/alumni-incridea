"use client";

import { useSession } from "next-auth/react";
import Volunteer from "~/components/volunteer";
import Verifier from "~/components/verifier";
import { ImSpinner } from "react-icons/im";
import Admin from "~/components/admin";
import Alumni from "~/components/alumni";
import PleaseLogin from "~/components/general/pleaseLogin";
import Unauthorised from "~/components/general/unauthorised";

const Home = () => {
  const { data: session, status: sessionStatus } = useSession();

  return (
    <div className="flex min-h-screen h-screen pt-28 pb-10 items-center justify-center">
      {sessionStatus === "loading" ? (
        <ImSpinner className="animate-spin size-20 text-white" />
      ) : sessionStatus !== "authenticated" ? (
        <PleaseLogin />
      ) : session.user.role === "ADMIN" ? (
        <Admin />
      ) : session.user.role === "VOLUNTEER" ? (
        <Volunteer />
      ) : session.user.role === "VERIFIER" ? (
        <Verifier />
      ) : session.user.email.endsWith("@nitte.edu.in") ||
        session.user.email.endsWith("@nmamit.in") ? (
        <Unauthorised />
      ) : (
        <Alumni />
      )}
    </div>
  );
}

export default Home;
