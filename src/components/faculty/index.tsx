"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import SelfPass from "./selfPass";
import QRCode from "react-qr-code";
import { dependantNum2ID, facultyNum2ID } from "~/lib/utils";
import { api } from "~/trpc/react";
import ClaimExtraPass from "./claimExtraPass";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";

export default function Faculty() {
  const { data: session } = useSession();
  const [claimed, setClaimed] = useState(session?.user.passClaimed ?? false);
  const facultyID = facultyNum2ID(parseInt(session?.user.id ?? "0", 10));
  const { data: extraPasses, refetch: refetchExtraPasses } =
    api.pass.getExtraPasses.useQuery();

  const day = api.volunteer.getDay.useQuery().data;

  const attended = " text-green-500 bg-white";
  const notAttended = "text-red-500 bg-white";

  if (!claimed) {
    return <SelfPass onClaim={setClaimed} />;
  }

  return (
    <div className="flex w-full items-center justify-center gap-4 py-28">
      <div className="flex flex-wrap justify-center gap-6">
        <div className="relative">
          <Image
            src={day?.day === "DAY2" ? "/pass2.png" : "/pass1.png"}
            alt="Pass"
            width={300}
            height={600}
          />
          <div className="absolute inset-0 flex flex-col">
            <div className="absolute right-10 mt-[9.8rem] flex w-fit flex-col text-center font-bold text-white">
              <span>{facultyID}</span>
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
              <QRCode value={facultyID} size={82} className="rounded-md" />
            </div>
          </div>
        </div>

        {(extraPasses ?? []).length > 0 &&
          (extraPasses ?? []).map((pass) => (
            <div className="relative" key={pass.id}>
              <Image
                src={day?.day === "DAY1" ? "/pass1.png" : "/pass2.png"}
                alt="Pass"
                width={300}
                height={600}
              />
              <div className="absolute inset-0 flex flex-col">
                <div className="absolute right-10 mt-[9.8rem] flex w-fit flex-col items-center justify-center text-center font-bold text-white">
                  <span>{dependantNum2ID(pass.id)}</span>
                  <span>
                    {(pass.name ?? "").length > 15
                      ? pass.name.substring(0, 12) + "..."
                      : pass.name}
                  </span>
                  <div className="flex gap-2 pt-2">
                    <Badge
                      className={pass.attendedDay1 ? attended : notAttended}
                    >
                      Day 1
                    </Badge>
                    <Badge
                      className={pass.attendedDay2 ? attended : notAttended}
                    >
                      Day 2
                    </Badge>
                  </div>
                </div>

                <div className="absolute left-[2.2rem] top-[9.25rem]">
                  <QRCode
                    value={dependantNum2ID(pass.id)}
                    size={82}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="fixed bottom-0 flex w-full flex-col items-center justify-center gap-4 rounded-t-xl">
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-t-2xl bg-palate_3 p-4 text-palate_2 md:flex-row">
          <p className="text-center text-white">
            You have{" "}
            <span className="text-gray-200 underline">
              {2 - (extraPasses?.length ?? 0)}
            </span>{" "}
            free passes to be claimed.
          </p>
          {2 - (extraPasses?.length ?? 0) > 0 && (
            <ClaimExtraPass passesRefetch={refetchExtraPasses} />
          )}
        </div>
      </div>
    </div>
  );
}
