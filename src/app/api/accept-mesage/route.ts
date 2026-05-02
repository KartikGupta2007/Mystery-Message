import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { User } from 'next-auth';

// GET to fetch the current acceptingMessage status of the user
export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if(!session || !user) {
        return Response.json(
            {
                success:false,
                message:"You are not authenticated"
            },{
                status: 401
            }
        )
    }
    const userId = user._id; 
    const body = await request.json().catch(() => null);
    const acceptingMessage = body?.acceptingMessage;

    if (typeof acceptingMessage !== 'boolean') {
        return Response.json(
            {
                success: false,
                message: 'Invalid request payload'
            },{ status: 400 }
        )
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptingMessage },
            { new: true }
        );
        if (updatedUser) {
            return Response.json(
                {
                    success: true,
                    message: "Message acceptance updated successfully"
                },{ status: 200 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },{ status: 404 }
            );
        }
    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Error occurred while updating message acceptance"
            },{ status: 500 }
        )
    }
}

//POST to update the acceptingMessage status of the user.
export async function GET(request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if(!session || !user) {
        return Response.json(
            {
                success:false,
                message:"You are not authenticated"
            },{
                status: 401
            }
        )
    }
    const userId = user._id; 

    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                {
                    success:false,
                    message: "User not found"
                },{ status: 404 }
            )
        }
    
        return Response.json(
            {
                success: true,
                message: "User found",
                isAcceptingMessages: foundUser.isAcceptingMessages
            },{ status: 200 }
        )
    } catch (error) {
        console.error("Error occurred while fetching user:", error);
        return Response.json(
            {
                success: false,
                message: "Error occurred while fetching user"
            },{ status: 500 }
        )
    }
}