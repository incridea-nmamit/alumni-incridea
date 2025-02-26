import { Scanner } from "@yudiel/react-qr-scanner";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

const Volunteer = () => {
  const {data: session} = useSession();
  const auditLogMutation = api.audit.log.useMutation();
  const markAttendance = api.volunteer.markAttended.useMutation({
    onSuccess: async (data, variables) => {
      toast.success("Scanned successfully");
      await auditLogMutation.mutateAsync({
        sessionUser: session?.user.email ?? "unknown",
        description: `Marked attendance for user with pass ID ${variables.passId} for day ${variables.day} by ${session?.user.email ?? "unknown"}`,
        audit: 'AttendanceAudit'
      });
    },
    onError: () => {
      toast.error("Already Checked-In for the day! or Verification Issues");
    },
  });

  const day = api.volunteer.getDay.useQuery().data;

  return (
    <div>
      <Scanner
        onScan={(result) => {
          if (result[0]) {
            markAttendance.mutate({
              day: day?.day ?? "DAY1",
              passId: result[0].rawValue
            });
          } else {
            toast.error("Invalid QR");
          }
        }}
      />
    </div >
  );
}

export default Volunteer;
