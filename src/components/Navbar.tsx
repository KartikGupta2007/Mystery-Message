"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth'
import { Button } from './ui/button';
import { Home, LogOut, User as UserIcon } from 'lucide-react';
 

export default function Navbar() {
    const { data: session,status } = useSession();
    
    const user:User = session?.user;


    if(status === "loading"){
        return (
            <nav className="w-full bg-gray-800 px-4 py-4 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-300 transition-colors">
                        <Home className="w-5 h-5" />
                        Home
                    </Link>
                    <span className="text-sm text-gray-400">Loading...</span>
                </div>
            </nav>
        )
    }
    
    return (
    (status !== "authenticated") ? (
        <nav className="w-full bg-gray-800 px-4 py-4 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-300 transition-colors">
                    <Home className="w-5 h-5" />
                    True Feedback
                </Link>
                <div className="flex items-center gap-3">
                  <Link href="/sign-in" className="inline-flex">
                    <Button variant="outline" className="px-3 py-1 text-sm">Sign In</Button>
                  </Link>
                  <Link href="/sign-up" className="inline-flex">
                    <Button variant="outline" className="px-3 py-1 text-sm">Sign Up</Button>
                  </Link>
                </div>
            </div>
        </nav>
    ) : (
        <nav className="w-full bg-gray-800 px-4 py-4 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-300 transition-colors">
                    <Home className="w-5 h-5" />
                    Home
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-md">
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white font-medium">Welcome, {user.username}</span>
                    </div>
                    <Button onClick={() => signOut()} variant="outline" className="px-3 py-1 text-sm flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </nav>
    ))
}
