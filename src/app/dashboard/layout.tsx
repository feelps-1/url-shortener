import { ReactNode } from "react";

export default function DashboardLayout({children}: {children : ReactNode}){
    return (
        <div>
            {/* <Sidebar /> */}
            <main>
                {children}
            </main>
        </div>
    )
}