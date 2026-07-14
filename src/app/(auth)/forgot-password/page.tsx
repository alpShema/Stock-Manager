"use client"

import { useState } from "react"
import { KeyRound, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) { setError("Please enter your email address."); return }
    setLoading(true); setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? "Something went wrong. Please try again."); return }
      setSuccess(true)
    } catch {
      setError("Unable to connect to the server. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#e4effe" }}>
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow">

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 rounded-full p-3">
            <KeyRound className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-center font-bold text-blue-600 text-lg">DALYDA Stock Manager</h1>

        {success ? (
          <div className="text-center mt-4">
            <p className="text-gray-700 font-medium mb-2">Check your email</p>
            <p className="text-sm text-gray-500 mb-6">
              A password reset link has been sent to <strong>{email}</strong>. Check your inbox and follow the instructions.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 text-sm mt-1 mb-6">Enter your email to receive a password reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                  <span>⚠</span><p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-2">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </form>
          </>
        )}
      </div>

      <footer className="mt-6">
        <p className="text-center text-gray-500 text-sm">© 2025 DALYDA Stock Manager. All rights reserved.</p>
      </footer>
    </main>
  )
}
