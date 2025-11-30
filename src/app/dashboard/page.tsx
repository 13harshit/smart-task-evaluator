'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function Dashboard() {
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) setTasks(data)
            setLoading(false)
        }
        fetchTasks()
    }, [])

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Tasks</h1>
                <Link href="/dashboard/submit">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <p className="text-muted-foreground">Loading tasks...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
                    <p className="text-gray-500 mb-4">You haven't submitted any tasks yet.</p>
                    <Link href="/dashboard/submit">
                        <Button variant="outline">Submit your first task</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <Link key={task.id} href={`/dashboard/report/${task.id}`}>
                            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{task.title}</CardTitle>
                                    <CardDescription>{new Date(task.created_at).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                                        {task.description || "No description provided."}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
