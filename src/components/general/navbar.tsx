"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed z-[1000] mx-2 lg:mx-[5%] mt-[16px] w-[calc(100%-16px)] max-w-full lg:w-[90%] rounded-3xl bg-blue-800 py-4 shadow-2xl lg:backdrop-blur-xl`}
    >
      <div className="container relative mx-auto px-4 lg:text-sm max-w-full">
        <div className="flex items-center justify-between px-4 lg:px-16">
          <div className="flex items-center">
            <Image
              className="mr-1 lg:mr-2"
              src="/logo.png"
              alt="Logo"
              width={100}
              height={40}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-16">
            <div className="flex gap-16 text-white">
              <a href="https://incridea.in" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                INCRIDEA.IN
              </a>
              <a href="https://capture.incridea.in" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                CAPTURE INCRIDEA
              </a>
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Sliding Menu */}
        <div className={`
          fixed top-0 right-0 h-full w-64 bg-blue-800 transform transition-transform duration-300 ease-in-out z-[1001] overflow-y-auto
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:hidden
        `}>
          <div className="p-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mb-8 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center gap-6 text-white text-center pt-8">  {/* Added items-center, text-center, and pt-8 */}
              <a href="https://incridea.in" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                INCRIDEA.IN
              </a>
              <a href="https://capture.incridea.in" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                CAPTURE INCRIDEA
              </a>
              <div className="mt-4">
                {session ? (
                  <button
                    className={`w-full rounded-3xl bg-white px-3 py-2 font-semibold text-blue-700`}
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    className={`w-full rounded-3xl bg-white px-3 py-2 font-semibold text-blue-700`}
                    onClick={() => signIn("google")}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
