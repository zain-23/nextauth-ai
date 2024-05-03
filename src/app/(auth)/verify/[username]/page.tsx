import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Page = ({ params }: { params: { username: string } }) => {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
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
      <InputOTP maxLength={6}>
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
    </main>
  );
};

export default Page;
