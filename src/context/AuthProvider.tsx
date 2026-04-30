'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }: { children: React.ReactNode }){
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}


// this small file is doing something important for your authentication flow—it makes session data available everywhere in your React app (client side).
// By wrapping your app with SessionProvider, you can easily access the user's session data (like whether they're logged in, their email, etc.) from any component using the useSession hook provided by next-auth. This is crucial for showing different UI elements based on the user's authentication status (like showing a login button when they're not logged in, or showing their profile info when they are).