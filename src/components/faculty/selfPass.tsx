import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

interface SelfPassProps {
  onClaim: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelfPass({ onClaim }: SelfPassProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const claimSelfpass = api.pass.claimFacultyPass.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      toast.success("Thank you for claiming your pass!");
      onClaim(true);
    },
    onError: () => {
      setIsSubmitting(false);
      toast.error("Oops! Something went wrong");
      onClaim(false);
    },
  });

  const validatePhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  return (
    <div className="flex items-center justify-center py-24">
      <Card className="mx-4 w-full max-w-md border border-none bg-palate_3 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Claim Your Pass
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center">
            Enter your phone number and claim your faculty pass.
          </p>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setError("");
            }}
            className="bg-white text-black"
          />
          {error && <p className="text-red-400">{error}</p>}
          <Button
            onClick={async () => {
              if (!validatePhoneNumber(phoneNumber)) {
                setError("Please enter a valid 10-digit phone number");
                return;
              }
              setIsSubmitting(true);
              await claimSelfpass.mutateAsync({ phoneNumber });
            }}
            disabled={isSubmitting}
            className="bg-white text-red-800 hover:bg-white hover:text-red-800"
          >
            {isSubmitting ? "Claiming..." : "Claim My Pass"}
          </Button>
          {isSubmitting && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-12 w-12"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
