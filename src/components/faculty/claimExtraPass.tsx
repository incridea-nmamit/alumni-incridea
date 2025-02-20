import React, { useState } from "react";
import { CldImage, CldUploadButton } from "next-cloudinary";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { env } from "~/env";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Relation } from "@prisma/client";
export default function ClaimExtraPass({
  passesRefetch,
}: {
  passesRefetch: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const passSchema = z.object({
    name: z.string().min(3, {
      message: "Name should be minimum 3 characters.",
    }),
    relation: z.nativeEnum(Relation),
    age: z.number().min(16, { message: "Minimum 16 years of age." }),
    idProof: z.string().url({ message: "ID Proof is mandatory" }),
  });

  const form = useForm<z.infer<typeof passSchema>>({
    resolver: zodResolver(passSchema),
    defaultValues: {
      age: 0,
      idProof: "",
      name: "",
      relation: "SPOUSE",
    },
  });

  const claimExtraPass = api.pass.claimExtraPass.useMutation({
    onSuccess: () => {
      toast.success("Claimed free pass successfully");
      form.reset();
      setIsModalOpen(false);
      passesRefetch();
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const onSubmit = async (values: z.infer<typeof passSchema>) => {
    await claimExtraPass.mutateAsync({
      age: values.age,
      idProof: values.idProof,
      name: values.name,
      relation: values.relation,
    });
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-white text-red-800 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-red-800"
      >
        Claim Your Free Pass
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative mx-6 w-[30rem] rounded bg-white p-6 shadow">
            <button
              className="absolute right-5 top-5"
              onClick={() => setIsModalOpen(false)}
            >
              <X />
            </button>
            <h2 className="mb-4 text-lg font-bold">Claim Free Pass</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Age"
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Relation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PARENT">Parent</SelectItem>
                            <SelectItem value="CHILD">Child</SelectItem>
                            <SelectItem value="SIBLING">Sibling</SelectItem>
                            <SelectItem value="SPOUSE">Spouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {field.value ? (
                          <CldImage
                            src={field.value}
                            alt="ID Proof"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <CldUploadButton
                            uploadPreset={
                              env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                            }
                            onSuccess={(res) => {
                              if (res.info) {
                                //@ts-expect-error It is what it is
                                field.onChange(res.info.secure_url);
                              }
                            }}
                            className="rounded-lg bg-red-800 px-4 py-2 text-white"
                          >
                            Upload ID Proof
                          </CldUploadButton>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full justify-end">
                  <Button
                    type="submit"
                    className="bg-red-800 text-white hover:bg-red-800 hover:text-white"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
