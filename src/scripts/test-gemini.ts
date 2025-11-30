import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    try {
        // Note: listModels is not directly exposed on the client instance in some versions,
        // but we can try to get a model and check if it works, or use the model manager if available.
        // Actually, for the JS SDK, we usually just try to generate content.
        // But let's try to use the 'gemini-1.5-flash-8b' or 'gemini-1.5-pro' to see if those work.

        // Let's just try a simple generation with a few candidates
        const candidates = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro']

        for (const modelName of candidates) {
            console.log(`Testing model: ${modelName}...`)
            try {
                const model = genAI.getGenerativeModel({ model: modelName })
                const result = await model.generateContent('Hello')
                console.log(`✅ SUCCESS: ${modelName} works!`)
                return // Found one
            } catch (e: any) {
                console.log(`❌ FAILED: ${modelName} - ${e.message.split('\n')[0]}`)
            }
        }
    } catch (error) {
        console.error('Fatal error:', error)
    }
}

listModels()
