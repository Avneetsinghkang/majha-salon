"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import Navbar from "@/components/Navbar"

const ADMIN_EMAIL = "jobankang7005@gmail.com"

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const typedEmail = email.trim().toLowerCase()

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: typedEmail,
      password,
    })

    if (loginError) {
      setLoading(false)
      setError(loginError.message)
      return
    }

    const userEmail = (
      data.user?.email ||
      data.session?.user?.email ||
      typedEmail
    )
      .trim()
      .toLowerCase()

    if (
      userEmail === ADMIN_EMAIL.toLowerCase() ||
      typedEmail === ADMIN_EMAIL.toLowerCase()
    ) {
      window.location.href = "/admin"
      return
    }

    window.location.href = "/my-bookings"
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6 flex justify-center">
        <div className="w-full max-w-md border border-white/10 bg-zinc-950 p-8">
          <h1 className="text-2xl font-light tracking-[0.2em] text-center">
            CUSTOMER LOGIN
          </h1>
          <div className="w-12 h-0.5 bg-yellow-500 mx-auto mt-4 mb-8"></div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/20 px-3 py-2"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/20 px-3 py-2"
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            New customer?{" "}
            <Link href="/signup" className="text-yellow-500 hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500 mt-3">
            Staff?{" "}
            <Link href="/admin/login" className="text-yellow-500 hover:underline">
              Admin login
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}