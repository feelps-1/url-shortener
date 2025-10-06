"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Skeleton } from "./ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import Link from "next/link"

export default function LoginButton(){
    const {data: session, status} = useSession()

    if(status == "loading"){
        return <Skeleton className="h-10 w-10 rounded-full"/>
    }

    if(session){
        const userInitials = session.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={session.user?.image ?? undefined} alt="Foto do perfil"/>
                        <AvatarFallback>{userInitials.length > 1 ? userInitials[0]+userInitials[userInitials.length-1] : userInitials[0].substring(0, 2)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem >
                        <Link href="/dashboard/my-links">Meus links</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => signOut()}>
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <button onClick={() => signIn("google")}>
            Entrar com google
        </button>
    )
}