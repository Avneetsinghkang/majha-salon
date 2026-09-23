"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"

const ADMIN_EMAIL = "jobankang7005@gmail.com"

export default function MyBookingsPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadData() {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        router.push("/login")
        return
      }

      if ((user.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        window.location.href = "/admin"
        return
      }

      setEmail(user.email || "")

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          customer_name,
          customer_email,
          start_time,
          end_time,
          status,
          services (
            name,
            price
          )
        `
        )
        .eq("customer_email", user.email)
        .order("start_time", { ascending: true })

      if (error) {
        console.error(error.message)
      }

      setAppointments(data ?? [])
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  async function cancelBooking(id: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id)

    if (error) {
      setMessage(error.message)
      return
    }

    setAppointments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "cancelled" } : item
      )
    )
    setMessage("Booking cancelled.")
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-NZ", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-NZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading your bookings...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div>
              <h1 className="text-lg font-light tracking-[0.2em]">MAJHA SALON</h1>
              <p className="text-xs tracking-[0.3em] text-yellow-500">MY BOOKINGS</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/book">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
                Book Again
              </Button>
            </Link>
            <Button
              type="button"
              className="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-light tracking-[0.15em] mb-2">YOUR APPOINTMENTS</h2>
        <div className="w-12 h-0.5 bg-yellow-500 mb-4"></div>
        <p className="text-gray-400 mb-8">{email}</p>

        {message && <p className="text-yellow-500 mb-6">{message}</p>}

        {appointments.length === 0 ? (
          <div>
            <p className="text-gray-500 mb-6">You have no bookings yet.</p>
            <Link href="/book">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
                Book Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="border border-white/10 bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-lg tracking-wide">
                    {appt.services?.name || "Service"}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatDate(appt.start_time)} · {formatTime(appt.start_time)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ${Number(appt.services?.price || 0).toFixed(0)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block text-xs px-3 py-1 border border-white/20 text-gray-300 uppercase">
                    {appt.status}
                  </span>

                  {appt.status === "confirmed" && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white"
                        onClick={() => cancelBooking(appt.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}