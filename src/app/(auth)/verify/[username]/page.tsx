"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { username: string } }) => {
  const [verifyCode, setVerifyCode] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async () => {
    setIsVerifying(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: verifyCode,
      });
      toast({
        title: "Verify Successfully",
        description: response?.data.message,
      });
      router.replace("/");
    } catch (error) {
      console.log("Error in verify user");
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verify failed",
        variant: "destructive",
        description: axiosError.response?.data.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center relative">
      <div className="max-w-2xl">
        <h1 className="mb-5 text-4xl text-center">
          Verify your code{" "}
          <span>
            {'"'}
            {params.username}
            {'"'}
          </span>
          , which you in your email.
        </h1>
      </div>
      <InputOTP
        maxLength={6}
        onChange={(code) => setVerifyCode(code)}
        onComplete={onSubmit}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="w-16 h-16 text-2xl" />
          <InputOTPSlot index={1} className="w-16 h-16 text-2xl" />
          <InputOTPSlot index={2} className="w-16 h-16 text-2xl" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} className="w-16 h-16 text-2xl" />
          <InputOTPSlot index={4} className="w-16 h-16 text-2xl" />
          <InputOTPSlot index={5} className="w-16 h-16 text-2xl" />
        </InputOTPGroup>
      </InputOTP>
      {isVerifying ? (
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-background/60 flex justify-center items-center">
          <Loader className="animate-spin w-20 h-20" />
        </div>
      ) : null}
    </main>
  );
};

export default Page;
