'use client'
import BadCounter from '@/components/BadCounter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DemoPage() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Code Editing Demo</h1>
            <p className="text-gray-500">
                This page renders a <code>BadCounter</code> component that has performance issues,
                bad practices, and bugs. We will use the Smart Task Evaluator to fix it.
            </p>

            <Card className="border-red-500">
                <CardHeader>
                    <CardTitle className="text-red-500">Broken Component Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <BadCounter />
                </CardContent>
            </Card>

            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Instructions:</h3>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>Copy the code from <code>src/components/BadCounter.tsx</code></li>
                    <li>Go to <b>Dashboard</b> -&gt; <b>New Task</b></li>
                    <li>Paste the code and submit it.</li>
                    <li>See how the AI refactors and fixes it!</li>
                </ol>
            </div>
        </div>
    )
}
