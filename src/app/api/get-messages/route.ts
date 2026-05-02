import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/model/user.model";
import { User } from "next-auth";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      {
        status: 401,
      },
    );
  }
  try {
    const user = await UserModel.findById(_user._id)
      .select("messages")
      .lean();

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    const messages = [...(user.messages ?? [])].sort(
      (firstMessage, secondMessage) =>
        new Date(secondMessage.createdAt).getTime() -
        new Date(firstMessage.createdAt).getTime(),
    );

    return Response.json(
      {
        messages,
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
        { message: "Error fetching messages", success: false },
        { status: 500 }
    )
  }
}
