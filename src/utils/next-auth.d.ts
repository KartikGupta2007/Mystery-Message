import 'next-auth';
import { Message } from '@/model/user.model';

declare module 'next-auth' {
    // By default, NextAuth -> session.user only has name, email and image properties. We can extend it to include other properties that we want to use in our application.
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      messages?: Message[];
    } & DefaultSession['user'];
  }
//  Now TypeScript understands: “Oh, session.user ALSO has these custom fields”

//   This represents the user object returned from authorize() function in the CredentialsProvider. We can add any custom fields that we want to use in our application.
// this is the user object that we return from the authorize() function in the CredentialsProvider, and it will be available in the jwt callback as the user parameter, and we can add any custom fields that we want to use in our application.
  interface User {
    _id?: string;
    email?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    messages?: Message[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    username?: string;
    email?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    messages?: Message[];
  }
}