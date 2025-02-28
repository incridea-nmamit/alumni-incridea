"use client";
import { useSession } from "next-auth/react";
import React from "react";
import QRCode from "react-qr-code";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { alumniNum2ID } from "~/lib/utils";

const Alumni = () => {
  const { data: session } = useSession();

  const alumniID = alumniNum2ID(parseInt(session?.user.id ?? "0", 10));

  const day = api.volunteer.getDay.useQuery().data;

  return (
    <div className="flex w-full items-center justify-center gap-4 py-28">
      <div className="flex flex-wrap justify-center gap-6">
        {session?.user.role === "ALUMNI" ? (
          <div className="relative">
            <div className="drop-shadow-[0_0_15px_rgba(0,0,0,0.7)]">
              <Image
                src={day?.day === "DAY1" ? "/pass1.png" : "/pass2.png"}
                alt="Pass"
                width={300}
                height={600}
              />
            </div>
            <div className="absolute inset-0 flex flex-col">
              <div className="absolute right-10 mt-[9.8rem] flex w-fit flex-col text-center font-bold text-white">
                <span>{alumniID}</span>
                <span>
                  {(session?.user?.name ?? "").length > 15
                    ? session?.user?.name?.substring(0, 12) + "..."
                    : session?.user?.name}
                </span>
                <div className="flex gap-2 pt-2">
                  <Badge
                    className={
                      session.user.attendedDay1
                        ? "bg-white text-green-500"
                        : "bg-white text-blue-500"
                    }
                  >
                    Day 1
                  </Badge>
                  <Badge
                    className={
                      session.user.attendedDay2
                        ? "bg-white text-green-500"
                        : "bg-white text-blue-500"
                    }
                  >
                    Day 2
                  </Badge>
                </div>
              </div>

              <div className="absolute left-[2.2rem] top-[9.25rem]">
                <QRCode value={alumniID} size={82} className="rounded-md" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-blue-800 p-6 text-center text-white">
            <div>
              You{"'"}ll be able to see your pass once our team has verified
              your documents!
            </div>
            <div>Please check back in 24 hours</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumni;
