"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth'
import { Button } from './ui/button';
 

export default function Navbar() {
    const { data: session,status } = useSession();
    
    const user:User = session?.user;


    if(status === "loading"){
        return (
            <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-background border border-border text-foreground">
                <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">Home</Link>
                <span className="text-sm text-muted-foreground">Loading...</span>
            </nav>
        )
    }
    
    return (
    (status !== "authenticated") ? (
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-background border border-border text-foreground">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">Home</Link>
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="inline-flex">
                <Button variant="outline" className="px-3 py-1 text-sm">Sign In</Button>
              </Link>
              <Link href="/sign-up" className="inline-flex">
                <Button variant="outline" className="px-3 py-1 text-sm">Sign Up</Button>
              </Link>
            </div>
        </nav>
    ) : (
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-background border border-border text-foreground">
            <span className="text-sm text-foreground">Welcome, {user.username}</span>
            <Button onClick={() => signOut()} variant="outline" className="px-3 py-1 text-sm">Sign Out</Button>
        </nav>
    ))
}
