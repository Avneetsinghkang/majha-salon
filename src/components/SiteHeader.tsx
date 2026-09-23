"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

const ADMIN_EMAIL = "jobankang7005@gmail.com"

export default function SiteHeader() {
  const supabase = createClient()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email ?? null)
    }
    checkUser()
  }, [supabase])

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const loggedIn = !!email
  const isAdmin = email === ADMIN_EMAIL

  return (
    <header className="border-b border-white/10 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div>
            <h1 className="text-lg font-light tracking-[0.2em]">MAJHA SALON</h1>
            <p className="text-xs tracking-[0.3em] text-yellow-500">GROOMING</p>
          </div>
        </Link>

        <nav className="flex items-center gap-5 text-sm tracking-wider">
          <Link href="/services" className="hover:text-yellow-500">
            Services
          </Link>
          <Link href="/pricing" className="hover:text-yellow-500">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-yellow-500">
            About
          </Link>
          <Link href="/contact" className="hover:text-yellow-500">
            Contact
          </Link>

          <Link href="/book" className="text-yellow-500 hover:text-yellow-400">
            Book
          </Link>

          {!loggedIn && (
            <>
              <Link href="/login" className="hover:text-yellow-500">
                Login
              </Link>
              <Link href="/signup" className="hover:text-yellow-500">
                Sign Up
              </Link>
            </>
          )}

          {loggedIn && !isAdmin && (
            <>
              <Link href="/my-bookings" className="hover:text-yellow-500">
                My Bookings
              </Link>
              <button type="button" onClick={logout} className="hover:text-yellow-500">
                Logout
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <Link href="/admin" className="hover:text-yellow-500">
                Admin
              </Link>
              <button type="button" onClick={logout} className="hover:text-yellow-500">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}