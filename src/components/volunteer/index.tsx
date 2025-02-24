import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { api } from "~/trpc/react";

const Volunteer = () => {
  const markAttendance = api.volunteer.markAttended.useMutation({
    onSuccess: () => {
      toast.success("Scanned successfully");
    },
    onError: () => {
      toast.error("Already Checked-In for the day!");
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
