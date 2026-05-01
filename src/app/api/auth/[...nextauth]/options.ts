import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserModel } from "@/model/user.model";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/Resend";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Email/Username and Password are required");
        }
        await dbConnect();

        const { emailOrUsername, password } = credentials;
        const identifier = emailOrUsername.toLowerCase();

        const user = await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
          throw new Error("No user found with this Email or Username");
        } else {
          try {
            if (!user.isVerified) {
              const otp = Math.floor(
                100000 + Math.random() * 900000,
              ).toString();
              const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10mins

              // send verification email again with new otp and expiry time
              const emailResult = await sendVerificationEmail(
                user.email,
                user.username,
                otp,
              );
              if (!emailResult.success) {
                throw new Error(
                  "Email not Verified. Failed to send verification email. Please try again later.",
                );
              }

              user.verifyCode = otp;
              user.verifycodeExpiry = otpExpiry;
              await user.save();
              throw new Error(
                `Email not verified. A new verification email has been sent to your email address. You can login once you verify your email. username:${user.username}`,
              );
            } else {
              const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
              );
              if (!isPasswordValid) {
                throw new Error("Invalid username or password");
              }
              return {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                isAcceptingMessages: user.isAcceptingMessages,
                messages: user.messages,
              };
            }
          } catch (error: any) {
            throw new Error(
              error.message ||
                "An error occurred while processing your request in login",
            );
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id.toString();
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        // token.messages = user.messages;
      }
      return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.email = token.email;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            // session.user.messages = token.messages;
        }
        return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};



// auth flow:
// DB → user → JWT → session → frontend

//jwt stores data in tokens, and session stores data in cookies, but since we are using JWT strategy for session, so the session will also be stored in the token itself, and the cookie will only store the token. So when user login, we will create a token with the user data and send it to the client, and the client will store it in a cookie, and when user makes a request to the server, we will verify the token and get the user data from it.