"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (!email || !password) {
    setError("Both fields are required")
    return
  }

  if (!email.includes("@")) {
    setError("Please enter a valid email")
    return
  }

  setError(null)
  console.log("Email:", email)
  console.log("Password:", password)
  router.replace("/dashboard")
}

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}