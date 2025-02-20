"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import SelfPass from "./selfPass";
import QRCode from "react-qr-code";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { alumniNum2ID } from "~/lib/utils";

export default function Alumni() {
  const { data: session } = useSession();
  const [claimed, setClaimed] = useState(session?.user.passClaimed ?? false);
  const alumniID = alumniNum2ID(parseInt(session?.user.id ?? "0", 10));

  const day = api.volunteer.getDay.useQuery().data;

  const attended = " text-green-500 bg-white";
  const notAttended = "text-red-500 bg-white";

  if (!claimed) {
    return <SelfPass onClaim={setClaimed} />;
  }

  return (
    <div className="flex w-full items-center justify-center gap-4 py-28">
      <div className="flex flex-wrap justify-center gap-6">
        {session?.user.passClaimed ? (
          <div className="relative">
            <Image
              src={day?.day === "DAY2" ? "/pass2.png" : "/pass1.png"}
              alt="Pass"
              width={300}
              height={600}
            />
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
                      session?.user.attendedDay1 ? attended : notAttended
                    }
                  >
                    Day 1
                  </Badge>
                  <Badge
                    className={
                      session?.user.attendedDay2 ? attended : notAttended
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
          <div className="rounded-lg bg-red-800 p-6 text-white">
            You{"'"}ll be able to see your pass once our team has verified your
            documents! Please check back in 24 hours
          </div>
        )}

        <div className="fixed bottom-0 flex w-full flex-col items-center justify-center gap-4 rounded-t-xl">
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-t-2xl bg-palate_3 p-4 text-palate_2 md:flex-row">
            <p className="text-center text-white">
              If you have any issues with payments or anything, WhatsApp -
              0000000000
              {/* TODO: Add the correct number */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
