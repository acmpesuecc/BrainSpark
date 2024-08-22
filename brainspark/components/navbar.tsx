"use client";

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ModeToggle } from './modeToggle'
import { Lightbulb } from 'lucide-react'
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { status } = useSession();
    const router = useRouter();

    const showSession = () => {
        if (status === "authenticated") {
            return (
                <Button
                    onClick={() => {
                        signOut({ redirect: false }).then(() => {
                            router.push("/");
                        });

                    }}
                >
                    Sign Out
                </Button>
            )
        } else if (status === "loading") {
            return (
                <></>
            )
        } else {
            return (
                <Link href="/login">
                    <Button>Login</Button>
                </Link>
            )
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b">
            <div className="container flex h-14 items-center justify-between">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="text-xl font-bold sm:inline-block">BrainSpark</span>
                    <Lightbulb className="text-yellow-500 fill-yellow-500" />
                </Link>
                <div className="flex items-center space-x-2">
                    <ModeToggle />
                    {showSession()}
                </div>
            </div>
        </header>
    )
}
