import prisma from '@/lib/prisma';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShorteningLinkForm from '@/components/ShorteningLinkForm';

async function getDashboardStatus() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const userCount = await prisma.user.count()
    return { userCount, linkCount: 125, totalClicks: 2830 }
}

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    const stats = await getDashboardStatus()

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-3xl font-bold'>Bem-vindo, {session?.user?.name}!</h1>
                {/* <RefreshButton /> */}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Total de usuários</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-3xl font-bold'>{stats.userCount}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Total de cliques</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-3xl font-bold'>{stats.totalClicks}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Total de links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-3xl font-bold'>{stats.linkCount}</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <ShorteningLinkForm/>
            </div>
            <div></div>
        </div>
    )
}