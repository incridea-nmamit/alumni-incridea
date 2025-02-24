import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import Navbar from "../components/general/navbar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Alumni | Incridea",
  description: "Alumni portal for Incridea",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster position="top-center" />
        <SessionProvider>
          <TRPCReactProvider>
            <Navbar />
            <div className="flex min-h-screen w-screen h-screen overflow-scroll flex-col bg-gradient-to-b from-blue-800 to-blue-950">
              {children}
              <div className="fixed bottom-0 flex w-full flex-col items-center justify-center gap-4 rounded-t-xl">
                <div className="flex w-full flex-col items-center justify-center gap-4 rounded-t-2xl bg-blue-800 p-4 md:flex-row">
                  <p className="text-center text-sm text-white">
                    If you have any issues with payments or anything, WhatsApp {""}
                    <a href="tel:9513295282" className="col-span-1 md:col-span-3 hover:underline hover:text-blue-500">
                      +919513295282
                    </a>{" "} or {""}
                    <a href="tel:9448846524" className="col-span-1 md:col-span-3 hover:underline hover:text-blue-500">
                      +919448846524
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
