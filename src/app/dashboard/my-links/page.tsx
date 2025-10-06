import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MyLinksTable, { columns } from "@/components/MyLinksTable";
import { Link } from "@prisma/client";
import { getServerSession } from "next-auth";

async function getUserLinks(userId: string) : Promise<Link[]> {
    if(!userId){
        return []
    }

    const links = await prisma?.link.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) ?? [];

    return links;
}

export default async function MyLinksPage() {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id){
        return <p>Acesso negado. Por favor faça login</p>
    }

    const links = await getUserLinks(session.user.id)

    return (
        <div className="container mx-auto py-10">
            <MyLinksTable columns={columns} data={links} />
        </div>
    )
}