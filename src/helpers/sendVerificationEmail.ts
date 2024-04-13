import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emailTemplates/VerificationEmail";

export async function sendVerificaionEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello World",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification code send successfully" };
  } catch (error) {
    console.log(`Failed to send emails ${error}`);
    return { success: true, message: "Verification code send successfully" };
  }
}
