import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface SlugPageProps {
    params: {
        slug: string
    }
}

export default async function SlugPage({ params }: SlugPageProps) {
    const link = await prisma.link.findFirst({
        where: {
            slug: params.slug
        }
    })

    if(!link){
        notFound()
    }

    if(link.expiresAt && link.expiresAt < new Date()){
        notFound()
    }

    await prisma.link.update({
        where: {
            id: link.id
        },
        data: {
            clicks: {
                increment: 1
            }
        }
    })

    redirect(link.originalUrl)
}