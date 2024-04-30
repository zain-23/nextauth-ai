import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          messages: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          messages: "User not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        messages: "Message send successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error adding messages", error);
    return NextResponse.json(
      {
        success: false,
        messages: "Interval server error",
      },
      {
        status: 500,
      }
    );
  }
};
