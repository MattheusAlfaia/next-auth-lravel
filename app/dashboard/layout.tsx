'use client'

import { useAuth } from '@/hooks/auth';
import { ReactNode } from 'react';

const AppLayout = ({ children }: { children: ReactNode }) => {
    const { logout } = useAuth()

    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-800">
            {/* <Navigation user={user} /> */}
            <div>{user?.name} - 
                <button onClick={() => logout()}>Logout</button>    
            </div> 

            <main>{children}</main>
        </div>
    )
}

export default AppLayout
