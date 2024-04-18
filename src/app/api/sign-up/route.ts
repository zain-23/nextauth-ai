import { sendVerificaionEmail } from "@/helpers/sendVerificationEmail";
import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      true;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await user.save();
    }

    const emailResponse = await sendVerificaionEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log(`Error registering user ${error}`);
    return NextResponse.json(
      {
        success: false,
        message: "Error Registering user",
      },
      {
        status: 500,
      }
    );
  }
};
