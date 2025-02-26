import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";

export interface User {
  id: number;
  email: string;
  name: string | null;
  usn: string | null;


  idProof: string | null;
}

const VerificationCell = ({ row }: { row: { original: User } }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const utils = api.useUtils();
  const { mutate: updateVerification } = api.verifier.updateVerification.useMutation({
    onSuccess: () => {
      void utils.verifier.getAllUsers.invalidate();
      toast.success("User verification updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const {data :session} = useSession()
  const auditLogMutation = api.audit.log.useMutation();
  const handleVerification = async (status: boolean) => {
    updateVerification({
      userId: row.original.id,
      response: status ? "APPROVED" : "REJECTED",
    });
    await auditLogMutation.mutateAsync({
      sessionUser: session?.user.email ?? "unknown",
      description: `${status ? "Approved" : "Rejected"} verification for user ${row.original.email} by ${session?.user.email}`,
      audit: 'VerificationAudit'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 hover:text-blue-800">
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Verify User</DialogTitle>
          <DialogDescription>
            Approve pass claim for {row.original.email} ?
          </DialogDescription>
        </DialogHeader>

        {row.original.idProof && (
          <>
            <div className="relative w-full h-[500px] my-4">
              <Image
                src={`${row.original.idProof.replace('/upload/', '/upload/f_jpg/')}`}
                alt="ID Proof"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/50 hover:bg-white/75"
                onClick={() => setIsFullScreen(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
              <DialogContent className="max-w-[95vw] h-[95vh] p-0">
                <DialogHeader className="absolute top-2 left-2 z-10">
                  <DialogTitle className="text-white bg-black/50 px-3 py-1 rounded">
                    ID Proof - Full View
                  </DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-full">
                  <Image
                    src={`${row.original.idProof.replace('/upload/', '/upload/f_jpg/')}`}
                    alt="ID Proof"
                    fill
                    className="object-contain"
                    sizes="95vw"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/50 hover:bg-white/75"
                    onClick={() => setIsFullScreen(false)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        <DialogFooter>
          <Button onClick={() => handleVerification(true)}>
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleVerification(false)}
          >
            Decline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const VerifierColumns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "usn",
    header: "USN",
  },
  {
    id: "actions",
    cell: ({ row }) => <VerificationCell row={row} />,
  },
];
