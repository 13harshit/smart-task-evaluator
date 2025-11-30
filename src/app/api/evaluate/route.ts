import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {
        const { taskId, code, description } = await req.json()

        if (!taskId || !code) {
            return NextResponse.json({ error: 'Missing taskId or code' }, { status: 400 })
        }

        const modelsToTry = [
            'gemini-2.5-flash',
            'gemini-2.5-flash-latest',
            'gemini-2.5-pro',
            'gemini-2.5-pro-latest',
            'gemini-2.0-flash',
            'gemini-2.0-flash-latest',
            'gemini-2.0-pro',
            'gemini-2.0-pro-latest',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-1.5-pro',
            'gemini-1.5-pro-latest',
            'gemini-1.0-pro',
            'gemini-pro',
            'gemini-pro-vision'
        ]
        let result
        let usedModel = ''

        const prompt = `
      You are an expert senior software engineer and code reviewer.
      Evaluate the following code snippet based on the provided description.
      
      Description: ${description || 'No description provided'}
      
      Code:
      \`\`\`
      ${code}
      \`\`\`
      
      Provide the output in the following STRICT JSON format (do not include markdown code blocks, just the raw JSON):
      {
        "score": <number between 0 and 100>,
        "strengths": ["<strength 1>", "<strength 2>", ...],
        "improvements": ["<improvement 1>", "<improvement 2>", ...],
        "fixed_code": "<the fixed and optimized version of the code>"
      }
    `

        // Fallback logic for models
        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting evaluation with model: ${modelName}`)
                const model = genAI.getGenerativeModel({ model: modelName })
                result = await model.generateContent(prompt)
                usedModel = modelName
                console.log(`Success with model: ${modelName}`)
                break
            } catch (e: any) {
                console.error(`Failed with ${modelName}:`, e.message)
                if (modelName === modelsToTry[modelsToTry.length - 1]) {
                    // If this was the last model and it failed, throw the error
                    throw new Error(`All models failed. Last error: ${e.message}`)
                }
            }
        }

        if (!result) {
            throw new Error('Failed to generate content')
        }

        const response = await result.response
        const text = response.text()

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

        let evaluation
        try {
            evaluation = JSON.parse(cleanText)
        } catch (e) {
            console.error('Failed to parse AI response:', text)
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
        }

        // Save to Supabase
        const { error: dbError } = await supabase
            .from('evaluations')
            .insert({
                task_id: taskId,
                score: evaluation.score,
                strengths: evaluation.strengths,
                improvements: evaluation.improvements,
                fixed_code: evaluation.fixed_code
            })

        if (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json({ error: 'Failed to save evaluation' }, { status: 500 })
        }

        return NextResponse.json({ success: true, evaluation, usedModel })
    } catch (error: any) {
        console.error('Evaluation error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
