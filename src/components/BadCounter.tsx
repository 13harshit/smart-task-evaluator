'use client'
import { useState, useEffect } from 'react'

// BUG 1: Poorly named variables
// BUG 2: useEffect missing dependency (infinite loop potential or stale closure)
// BUG 3: Direct DOM manipulation
// BUG 4: Inline styles preventing Tailwind usage
// BUG 5: Heavy computation on every render

export default function BadCounter() {
    let [c, setC] = useState(0)
    const [data, setData] = useState<any>(null)

    // Heavy computation blocking the main thread
    const heavy = () => {
        let result = 0
        for (let i = 0; i < 100000000; i++) {
            result += i
        }
        return result
    }

    useEffect(() => {
        // Fetching on every render if not careful, or missing dependency
        console.log("Effect ran")
        document.title = `Count: ${c}` // Direct DOM manipulation
    })

    const inc = () => {
        setC(c + 1)
        // Mutating state directly (won't work, but is a common bug)
        // @ts-ignore
        c = c + 1
    }

    return (
        <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
            <h1>Bad Counter</h1>
            <p>Count: {c}</p>
            <p>Heavy Result: {heavy()}</p>
            <button onClick={inc} style={{ padding: '10px', background: 'blue' }}>
                Increment
            </button>
        </div>
    )
}
