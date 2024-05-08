import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { connectDB } from "@/lib/dbConnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "message.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Messages not found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed get messages");
    return NextResponse.json(
      {
        success: false,
        messages: "Failed get messages",
      },
      {
        status: 500,
      }
    );
  }
};
