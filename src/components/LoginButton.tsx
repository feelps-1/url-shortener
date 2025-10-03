"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function LoginButton(){
    const {data: session, status} = useSession()

    if(status == "loading"){
        return <p>Carregando...</p>
    }

    if(session){
        return (
            <div className="flex justify-center gap-2">
                <p>Olá, {session.user?.name}</p>
                <button onClick={() => signOut()}>Sair</button>
            </div>
        )
    }

    return (
        <button onClick={() => signIn("google")}>
            Entrar com google
        </button>
    )
}