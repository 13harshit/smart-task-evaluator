'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, AlertTriangle, Lock } from 'lucide-react'

export default function ReportPage() {
    const { id } = useParams()
    const [task, setTask] = useState<any>(null)
    const [evaluation, setEvaluation] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isPro, setIsPro] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Check if user is pro
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_pro')
                .eq('id', user.id)
                .single()

            if (profile) setIsPro(profile.is_pro)

            // Fetch Task
            const { data: taskData } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', id)
                .single()

            setTask(taskData)

            // Fetch Evaluation
            const { data: evalData } = await supabase
                .from('evaluations')
                .select('*')
                .eq('task_id', id)
                .single()

            setEvaluation(evalData)
            setLoading(false)
        }
        fetchData()
    }, [id])

    const router = useRouter() // Make sure to import useRouter from 'next/navigation' at the top if not already there

    const handleUnlock = () => {
        router.push(`/dashboard/payment?returnUrl=/dashboard/report/${id}`)
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (!task || !evaluation) return <div className="p-12 text-center">Report not found or processing...</div>

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{task.title}</h1>
                    <p className="text-gray-500">{new Date(task.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-primary">{evaluation.score}/100</div>
                    <p className="text-sm text-gray-500">AI Score</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-600">
                            <CheckCircle className="mr-2 h-5 w-5" /> Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            {evaluation.strengths?.map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-amber-600">
                            <AlertTriangle className="mr-2 h-5 w-5" /> Improvements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            {evaluation.improvements?.map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="relative overflow-hidden">
                <CardHeader>
                    <CardTitle>Optimized Code</CardTitle>
                    <CardDescription>AI-suggested improvements and fixes</CardDescription>
                </CardHeader>
                <CardContent>
                    {!isPro ? (
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                            <Lock className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Unlock Full Report</h3>
                            <p className="text-gray-500 mb-6 text-center max-w-md">
                                Get access to the full optimized code solution and detailed line-by-line analysis.
                            </p>
                            <Button onClick={handleUnlock} size="lg">
                                Unlock for $5
                            </Button>
                        </div>
                    ) : null}
                    <pre className={`bg-gray-950 text-gray-50 p-4 rounded-lg overflow-x-auto ${!isPro ? 'blur-sm select-none' : ''}`}>
                        <code>{evaluation.fixed_code}</code>
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}
