"use server"

import { getServerSession } from "next-auth"
import z from "zod"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { nanoid } from "nanoid"
import prisma from "@/lib/prisma";

const formSchema = z.object({
    longLink: z.string().url({ message: "URL inválida" })
})

export async function createShortLink(values: z.infer<typeof formSchema>) {
    const validatedFields = formSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Link inválido" }
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return { error: "Ação não autorizada. Por favor, faça login novamente." };
    }
    try {
        const { longLink } = validatedFields.data
        const slug = nanoid(7)

        await prisma.link.create({
            data: {
                originalUrl: longLink,
                slug: slug,
                userId: session.user.id
            }
        })
    } catch (error) {
        return { error: error }
    }
} 