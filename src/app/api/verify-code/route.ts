import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";

// This route will be used to verify the user's email, when user click on the verification link in the email, then this route will be called with the username and the code as query parameters, then we will check if the code is correct and not expired, if everything is fine then we will update the user's verification status to true.

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    if (!username || !code) {
    return Response.json(
        { success: false, message: "Username and code are required" },
        { status: 400 },
      );
    }
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifycodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status using findOneAndUpdate to bypass schema hooks
      const user = await UserModel.findOneAndUpdate(
        { username: decodedUsername },
        {
          $set: {
            isVerified: true,
            verifyCode: "",
            verifycodeExpiry: null
          }
        },
        { new: true }
      );
      return Response.json(
        { success: true, message: "Account verified successfully. Now you can sign in." },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        { success: false, message: "Verification code has expired. Please try to Sign-in again to get a new code." },
        { status: 400 },
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, 
        message: error || "An error occurred while verifying the account" 
      },
      { status: 500 },
    );
  }
}


//2026-04-30T10:45:z+00:00