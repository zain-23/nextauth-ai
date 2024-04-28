import { getServerSession } from "next-auth";
import { authOptions } from "../sign-up/[...nextauth]/options";
import UserModel from "@/model/User";
import { connectDB } from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authentication",
        },
        {
          status: 401,
        }
      );
    }
    const user = session?.user as User;
    const userId = user._id;

    const { accesptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isAcceptingMessage: accesptMessages,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update status to accept messages");
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send messages to update status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (request: Request) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authentication",
      },
      {
        status: 401,
      }
    );
  }

  const user = session?.user as User;
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error is getting message acceptance status", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error is getting message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
};
