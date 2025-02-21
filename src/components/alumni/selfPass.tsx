/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { env } from "~/env";
import { CldImage, CldUploadButton } from "next-cloudinary";
import Script from "next/script";

interface SelfPassProps {
  onClaim: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelfPass({ onClaim }: SelfPassProps) {
  const [details, setDetails] = useState<{
    phoneNumber: string;
    idProof: string;
    usn: string;
    yearOfGraduation: number;
  }>({
    phoneNumber: "",
    idProof: "",
    usn: "",
    yearOfGraduation: 2023,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const claimSelfpass = api.pass.claimPass.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      onClaim(true);
    },
    onError: () => {
      setIsSubmitting(false);
      toast.error("Oops! Something went wrong");
      onClaim(false);
    },
  });

  const changePaymentStatus = api.pass.changePaymentStatus.useMutation();

  const claimPass = async () => {
    if (!validatePhoneNumber(details.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (!details.idProof) {
      setError("Please upload your graduation certificate");
      return;
    }
    if (!details.usn) {
      setError("Please enter your USN");
      return;
    }
    setIsSubmitting(true);
    const payment = await claimSelfpass.mutateAsync({ ...details });

    const paymentObject = new (window as any).Razorpay({
      key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: payment.rzpOrderID,
      amount: 25600,
      currency: "INR",
      name: "Alumni Incridea",
      description: "Alumni Pass",
      notes: {
        address: "NMAM Institute of Technology, Nitte, Karkala",
      },
      theme: {
        color: "#04382b",
      },
      handler: async (response: any) => {
        try {
          if (response.razorpay_payment_id) {
            await changePaymentStatus.mutateAsync({
              orderId: payment.id,
              rzpPaymentID: response.razorpay_payment_id,
              status: "SUCCESS",
              response: response,
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    });

    paymentObject.open();
  };

  const validatePhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex items-center justify-center py-24">
        <Card className="mx-4 w-full max-w-md border border-none bg-blue-700/10 backdrop-blur-md shadow-2xl shadow-black/20 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Claim Your Pass
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center">Phone Number</p>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={details.phoneNumber}
              onChange={(e) => {
                setDetails({
                  ...details,
                  phoneNumber: e.target.value,
                });
                setError("");
              }}
              className="bg-white text-black"
            />
            <p className="text-center">USN</p>
            <Input
              type="text"
              placeholder="Enter your USN"
              value={details.usn}
              onChange={(e) => {
                setDetails({
                  ...details,
                  usn: e.target.value,
                });
                setError("");
              }}
              className="bg-white text-black"
            />
            <p className="text-center">Year of Graduation</p>
            <Input
              type="number"
              placeholder="Year Of Graduation"
              value={details.yearOfGraduation}
              onChange={(e) => {
                setDetails({
                  ...details,
                  yearOfGraduation: parseInt(e.target.value),
                });
                setError("");
              }}
              className="bg-white text-black"
            />
            {details.idProof ? (
              <CldImage
                src={details.idProof}
                alt="ID Proof"
                width={100}
                height={100}
              />
            ) : (
              <CldUploadButton
                uploadPreset={env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(res) => {
                  if (res.info) {
                    setDetails((prevDetails) => ({
                      ...prevDetails,
                      //@ts-expect-error It is what it is
                      idProof: res.info.secure_url as string,
                    }));
                    setError("");
                  }
                }}
                options={{
                  resourceType: "image",
                }}
                className="rounded-lg bg-blue-800 px-4 py-2 text-white"
              >
                Upload Graduation Certificate
              </CldUploadButton>
            )}
            {error && <p className="text-blue-400">{error}</p>}
            <Button
              onClick={async () => {
                await claimPass();
              }}
              disabled={isSubmitting}
              className="bg-white text-blue-800 hover:bg-white hover:text-blue-800"
            >
              {isSubmitting ? "Claiming..." : "Claim My Pass"}
            </Button>
            {isSubmitting && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
