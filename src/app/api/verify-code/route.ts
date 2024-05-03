import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does'nt exist",
        },
        {
          status: 500,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpire) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "User verfied",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpire) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verifcation code has expired please signup again to get a new code",
        },
        {
          status: 500,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verify user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Incorrect verification code",
      },
      {
        status: 400,
      }
    );
  }
};
