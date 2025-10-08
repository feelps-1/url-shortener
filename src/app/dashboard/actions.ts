"use server"

import { getServerSession } from "next-auth"
import z from "zod"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { nanoid } from "nanoid"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache"
import { Link } from "@prisma/client"

const formSchema = z.object({
    longLink: z.string().url({ message: "URL inválida" }),
    description: z.string().max(100).optional(),
    expiresAt: z.date().optional()
})

export async function createShortLink(values: z.infer<typeof formSchema>)
: Promise<{success?: string; error?: string; link?: Link}> {
    const validatedFields = formSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Link inválido" }
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return { error: "Ação não autorizada. Por favor, faça login novamente." };
    }
    try {
        const { longLink, description, expiresAt } = validatedFields.data
        const slug = nanoid(7)

        const newLink = await prisma.link.create({
            data: {
                originalUrl: longLink,
                slug: slug,
                userId: session.user.id,
                description: description,
                expiresAt: expiresAt,      
            }
        })

        revalidatePath("/dashboard")

        return { success: "Link encurtado com sucesso", link: newLink }
    } catch (error) {
        return { error: "Não foi possível criar o link. Tente novamente." }
    }
} 

export async function deleteLink(linkId: string){
    const session = await getServerSession(authOptions)

    if(!session?.user?.id){
        return { error: "Não autorizado" }
    }

    try{
        await prisma.link.delete({
            where: {
                id: linkId,
                userId: session.user.id
            }
        })

        revalidatePath("/dashboard/my-links")
        return { success: "Link excluído com sucesso! "}
    }catch (error) {
        return { error: "Não foi possível excluir o link! "}
    }
}