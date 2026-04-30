import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { z } from "zod";
import { userNameValidation } from "../../../schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: userNameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username : searchParams.get("username") || "",
        }

        // validate the query param using zod schema
        const parsedQuery = UsernameQuerySchema.safeParse(queryParam);

        if (!parsedQuery.success){
            const usernameErrors = parsedQuery.error.format().username?._errors || [];
            return Response.json({
                    success: false,
                    message: "Invalid username",
                    errors: usernameErrors,
                },
                { status: 400 }
            );
        }

        const { username } = parsedQuery.data;

        const IfUsernameAvl = await UserModel.findOne({
            username,
        })

        if(IfUsernameAvl){
            return Response.json({
                success: false,
                message: "Username already taken, please choose a different username",
            },
            { status: 400 }
        );
        }else{
            return Response.json({
                success: true,
                message: "Username is unique",
            },
            { status: 200 }
        );
        }
    }catch (error) {
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}