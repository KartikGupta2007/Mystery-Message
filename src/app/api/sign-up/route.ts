import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { sendVerificationEmail } from "../../../lib/Resend";


//sign-up route, here we will create new user and send verification email to the user, so that user can verify their email and then login to the app.

export async function POST(request : Request){
    await dbConnect();

    try {
        let { username, email, password } = await request.json();
        
        if (!username || !email || !password) {
            return new Response(
                JSON.stringify({
                    statusCode: 400,
                    success: false,
                    message: "Username, email and password are required"
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        username = username.toLowerCase();
        
        const existingUserByThisEmail = await UserModel.findOne({
            email,
        });
        const existingUserByThisUsername = await UserModel.findOne({
            username
        });

        if(existingUserByThisEmail){
            return new Response(
                JSON.stringify({
                    statusCode: 400,
                    success: false,
                    message: "User with this email already exists, please login instead"
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        else if(existingUserByThisUsername){
            return new Response(
                JSON.stringify({
                    statusCode: 400,
                    success: false,
                    message: "Username already taken, please choose a different username"
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }else{
            // only new user(new username and new email) will come to this block, so we will create new user and send verification email
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10mins

            const newUser = new UserModel({
                username : username,
                email,
                password,
                verifyCode: otp,
                verifycodeExpiry: otpExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save();

            // Send verification email
            const emailResult = await sendVerificationEmail(email, username, otp, `${request.url}/verify/${username}`);
            if(!emailResult.success){
                return new Response(
                    JSON.stringify({
                        statusCode: 500,
                        success: false,
                        message: emailResult.message || "Failed to send verification email"
                    }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                );
            }else{
                return new Response(
                    JSON.stringify({
                        statusCode: 201,
                        success: true,
                        message: "User registered successfully. Verification email sent. Please verify your email to complete the registration process."
                    }),
                    { status: 201, headers: { "Content-Type": "application/json" } }
                );
            }
        }


    }catch (error) {
        console.error('Error in sign-up route:', error);
        return new Response(
            JSON.stringify({
                statusCode: 500,
                success: false,
                message: "Error in sign-up route"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}