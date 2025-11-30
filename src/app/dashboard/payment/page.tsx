'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Lock } from 'lucide-react'

export default function PaymentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnUrl = searchParams.get('returnUrl') || '/dashboard'

    const [loading, setLoading] = useState(false)
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [name, setName] = useState('')

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Secure Checkout
                    </CardTitle>
                    <CardDescription>
                        Unlock full reports and AI code fixes for $5.00
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Cardholder Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card">Card Number</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="card"
                                    className="pl-9"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input
                                    id="cvc"
                                    placeholder="123"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Subtotal</span>
                                <span>$5.00</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>$5.00</span>
                            </div>
                        </div>

                        <Button className="w-full mt-4" type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Pay $5.00
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-xs text-gray-500">
                    <p>This is a secure 256-bit SSL encrypted payment.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
