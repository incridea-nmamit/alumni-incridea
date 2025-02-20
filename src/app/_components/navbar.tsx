"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav
      className={`fixed z-50 mx-4 mt-[16px] grid w-[calc(100%-32px)] rounded-3xl bg-blue-800 py-4 shadow-2xl lg:mx-[5%] lg:w-[90%] lg:backdrop-blur-xl`}
    >
      <div className="container relative mx-auto px-4 lg:text-sm">
        <div className="flex items-center justify-between px-16">
          <div className="flex items-center">
            <Image
              className="mr-2"
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </div>

          {session ? (
            <button
              className={`rounded-3xl bg-white px-3 py-2 font-semibold text-blue-700`}
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          ) : (
            <button
              className={`rounded-3xl bg-white px-3 py-2 font-semibold text-blue-700`}
              onClick={() => signIn("google")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
