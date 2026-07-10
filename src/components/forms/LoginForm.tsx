"use client"

import { LogIn } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"



export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null >(null)
    const [isLoading, setIsLoading] = useState(false)
    const setAuth = useAuthStore(state => state.setAuth)
    const router = useRouter()
    useEffect(() => {
  useAuthStore.persist.rehydrate()
}, [])




async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (!email || !password) {
    setError("Both fields are required")
    return
  }

  setError(null)

  setIsLoading(true)

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || "Login failed")
      return
    }

    setAuth(data.data, null, email)
    router.replace("/dashboard")

  } catch (err) {
    setError("Something went wrong. Please try again.")
  }finally {
    setIsLoading(false)
  }
}


  return (
    <form onSubmit={handleSubmit}>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Email Address
               </label>
            <input
             type="email" 
             value={email}
             onChange={e => setEmail(e.target.value)}
             placeholder="Enter your email"
             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

       {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
           <span>⚠</span><p>{error}</p>
          </div>
       )}
        <button  disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-6 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Signing in..." : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>

    </form>
  )
}
