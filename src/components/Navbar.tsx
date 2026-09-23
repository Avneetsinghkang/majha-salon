"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"

const ADMIN_EMAIL = "jobankang7005@gmail.com"

export default function Navbar() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email ?? null)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setEmail(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/">
          <div>
            <h1 className="text-xl font-light tracking-[0.2em] text-white">MAJHA</h1>
            <p className="text-xs tracking-[0.3em] text-yellow-500">SALON</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wider text-white">
          <Link href="/" className="hover:text-yellow-500 transition">HOME</Link>
          <Link href="/services" className="hover:text-yellow-500 transition">SERVICES</Link>
          <Link href="/pricing" className="hover:text-yellow-500 transition">PRICING</Link>
          <Link href="/about" className="hover:text-yellow-500 transition">ABOUT</Link>
          <Link href="/contact" className="hover:text-yellow-500 transition">CONTACT</Link>
        </nav>

        <div className="flex items-center gap-4 text-sm tracking-wider text-white">
          {email ? (
            <>
              <Link href="/my-bookings" className="hidden sm:inline hover:text-yellow-500 transition">
                MY BOOKINGS
              </Link>
              {email === ADMIN_EMAIL && (
                <Link href="/admin" className="hidden sm:inline hover:text-yellow-500 transition">
                  ADMIN
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-yellow-500 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-500 transition">
                LOGIN
              </Link>
              <Link href="/signup" className="hidden sm:inline hover:text-yellow-500 transition">
                SIGN UP
              </Link>
            </>
          )}

          <Link href="/book">
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6">
              BOOK NOW
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}