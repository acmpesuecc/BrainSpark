// 'use client'

// import { useState } from 'react'
// import { signIn } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertCircle } from 'lucide-react'

// export default function Component() {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState<string | null>(null)
//     const [isLoading, setIsLoading] = useState(false)
//     const router = useRouter()

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setIsLoading(true)
//         setError(null)

//         try {
//             const result = await signIn('credentials', {
//                 redirect: false,
//                 email,
//                 password,
//             })

//             if (result?.error) {
//                 setError('Invalid email or password')
//             } else {
//                 router.push('/')
//             }
//         } catch (error) {
//             setError('An unexpected error occurred')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <Card className="w-full max-w-md mx-auto mt-8">
//             <CardHeader>
//                 <CardTitle>Sign In</CardTitle>
//                 <CardDescription>Enter your credentials to access your task tracker</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="email">Email</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             placeholder="you@example.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="password">Password</Label>
//                         <Input
//                             id="password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     {error && (
//                         <div className="flex items-center space-x-2 text-red-500">
//                             <AlertCircle size={16} />
//                             <span className="text-sm">{error}</span>
//                         </div>
//                     )}
//                     <Button type="submit" className="w-full" disabled={isLoading}>
//                         {isLoading ? 'Signing in...' : 'Sign In'}
//                     </Button>
//                 </form>
//             </CardContent>
//             <CardFooter className="justify-center">
//                 <p className="text-sm text-muted-foreground">
//                     Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
//                 </p>
//             </CardFooter>
//         </Card>
//     )
// }

'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import Navbar from '@/components/navbar'

export default function Component() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else {
                router.push('/')
            }
        } catch (error) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access your task tracker</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="flex items-center space-x-2 text-red-500">
                                <AlertCircle size={16} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
