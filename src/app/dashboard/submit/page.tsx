'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function SubmitTaskPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Save Task
            const { data: task, error: taskError } = await supabase
                .from('tasks')
                .insert({
                    user_id: user.id,
                    title,
                    description,
                    code_content: code
                })
                .select()
                .single()

            if (taskError) throw taskError

            // 2. Trigger Evaluation API
            const response = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: task.id,
                    code,
                    description
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Evaluation failed')
            }

            router.push(`/dashboard/report/${task.id}`)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Submit New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. React Counter Component" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this code supposed to do?" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <textarea
                                id="code"
                                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                required
                                placeholder="// Paste your code here..."
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit for Evaluation
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
