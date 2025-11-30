'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b h-14 flex items-center px-8 bg-white dark:bg-gray-950">
                <Link href="/dashboard" className="font-bold text-xl">SmartEval</Link>
                <div className="ml-auto flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
            </header>
            <main className="flex-1 bg-gray-50/50 dark:bg-gray-900">
                {children}
            </main>
        </div>
    )
}
