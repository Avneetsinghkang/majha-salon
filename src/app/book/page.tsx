"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"

type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
}

type WorkingHour = {
  day_of_week?: number
  day?: string
  open_time?: string
  close_time?: string
  is_closed?: boolean
}

const DEFAULT_OPEN = "09:00"
const DEFAULT_CLOSE = "17:30"
const CLOSED_DAYS = [0] // 0 = Sunday

export default function BookPage() {
  const supabase = createClient()

  const [services, setServices] = useState<Service[]>([])
  const [hours, setHours] = useState<WorkingHour[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [dayClosed, setDayClosed] = useState(false)

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) return
      setCustomerEmail(user.email || "")
      setCustomerName(user.user_metadata?.full_name || "")
    }
    loadUser()
  }, [supabase])

  useEffect(() => {
    async function loadServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("name")

      if (!error) setServices(data || [])
      setLoading(false)
    }

    async function loadHours() {
      const { data } = await supabase.from("working_hours").select("*")
      setHours(data || [])
    }

    loadServices()
    loadHours()
  }, [supabase])

  useEffect(() => {
    async function loadBookedTimes() {
      if (!selectedDate) return

      const startOfDay = new Date(`${selectedDate}T00:00:00`).toISOString()
      const endOfDay = new Date(`${selectedDate}T23:59:59`).toISOString()

      const { data } = await supabase
        .from("appointments")
        .select("start_time, status")
        .gte("start_time", startOfDay)
        .lte("start_time", endOfDay)

      const times = (data || [])
        .filter((item) => item.status !== "cancelled")
        .map((item) => {
          const date = new Date(item.start_time)
          return `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        })

      setBookedTimes(times)
    }
    loadBookedTimes()
  }, [selectedDate, supabase])

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([])
      setDayClosed(false)
      return
    }

    const date = new Date(`${selectedDate}T12:00:00`)
    const weekday = date.getDay() // 0 Sunday ... 6 Saturday

    const row = hours.find((h) => {
      if (typeof h.day_of_week === "number") return h.day_of_week === weekday
      if (h.day) {
        const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        return h.day.toLowerCase() === names[weekday]
      }
      return false
    })

    const closed =
      row?.is_closed === true ||
      CLOSED_DAYS.includes(weekday) && !row

    if (closed) {
      setDayClosed(true)
      setTimeSlots([])
      setSelectedTime("")
      return
    }

    const open = (row?.open_time || DEFAULT_OPEN).slice(0, 5)
    const close = (row?.close_time || DEFAULT_CLOSE).slice(0, 5)

    const slots: string[] = []
    let [h, m] = open.split(":").map(Number)
    const [closeH, closeM] = close.split(":").map(Number)

    while (h < closeH || (h === closeH && m < closeM)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
      m += 30
      if (m >= 60) {
        h += 1
        m = 0
      }
    }

    const now = new Date()
    const isToday = selectedDate === now.toISOString().split("T")[0]
    const filtered = slots.filter((time) => {
      if (!isToday) return true
      const [th, tm] = time.split(":").map(Number)
      return th > now.getHours() || (th === now.getHours() && tm > now.getMinutes())
    })

    setDayClosed(false)
    setTimeSlots(filtered)
    setSelectedTime("")
  }, [selectedDate, hours])

  const today = new Date().toISOString().split("T")[0]

  async function handleBooking() {
    if (!selectedService || !selectedDate || !selectedTime) return
    if (!customerName || !customerEmail) {
      setError("Please enter your name and email.")
      return
    }

    setIsSubmitting(true)
    setError("")

    const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
    const endDateTime = new Date(
      startDateTime.getTime() + selectedService.duration_minutes * 60000
    )

    const { error: insertError } = await supabase.from("appointments").insert({
      service_id: selectedService.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: "confirmed",
    })

    setIsSubmitting(false)

    if (insertError) {
      setError(insertError.message || "This time was just booked. Please pick another.")
    } else {
      setStep(5)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div>
              <h1 className="text-lg font-light tracking-[0.2em]">MAJHA SALON</h1>
              <p className="text-xs tracking-[0.3em] text-yellow-500">GROOMING</p>
            </div>
          </Link>
          <span className="text-sm text-gray-400 tracking-wider">BOOK APPOINTMENT</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-light tracking-[0.15em] mb-2">CHOOSE A SERVICE</h2>
            <div className="w-12 h-0.5 bg-yellow-500 mb-8"></div>

            {loading ? (
              <p className="text-gray-500">Loading services...</p>
            ) : services.length === 0 ? (
              <p className="text-gray-500">No services available right now.</p>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-5 border cursor-pointer transition ${
                      selectedService?.id === service.id
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-white/10 hover:border-yellow-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg tracking-wider">{service.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {service.duration_minutes} minutes
                        </p>
                      </div>
                      <p className="text-yellow-500 text-xl">
                        ${Number(service.price).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedService && (
              <div className="mt-10 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8"
                >
                  CONTINUE
                </Button>
              </div>
            )}
          </>
        )}

        {step === 2 && selectedService && (
          <>
            <button onClick={() => setStep(1)} className="text-sm text-yellow-500 mb-6 hover:underline">
              ← Back
            </button>
            <h2 className="text-3xl font-light tracking-[0.15em] mb-2">CHOOSE A DATE</h2>
            <div className="w-12 h-0.5 bg-yellow-500 mb-4"></div>
            <p className="text-gray-400 mb-8">{selectedService.name}</p>

            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setSelectedTime("")
              }}
              className="w-full max-w-xs bg-zinc-900 border border-white/20 text-white px-4 py-3 focus:border-yellow-500 outline-none"
            />

            {selectedDate && dayClosed && (
              <p className="text-yellow-500 mt-6">Closed this day. Please pick another date.</p>
            )}

            {selectedDate && !dayClosed && (
              <div className="mt-10 flex justify-end">
                <Button
                  onClick={() => setStep(3)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8"
                >
                  CONTINUE
                </Button>
              </div>
            )}
          </>
        )}

        {step === 3 && selectedService && selectedDate && (
          <>
            <button onClick={() => setStep(2)} className="text-sm text-yellow-500 mb-6 hover:underline">
              ← Back
            </button>
            <h2 className="text-3xl font-light tracking-[0.15em] mb-2">CHOOSE A TIME</h2>
            <div className="w-12 h-0.5 bg-yellow-500 mb-4"></div>
            <p className="text-gray-400 mb-8">
              {selectedService.name} · {selectedDate}
            </p>

            {timeSlots.length === 0 ? (
              <p className="text-gray-500">No times left this day. Please pick another date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((time) => {
                  const isBooked = bookedTimes.includes(time)
                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      className={`py-3 text-sm tracking-wider transition ${
                        isBooked
                          ? "bg-zinc-900 text-gray-600 line-through cursor-not-allowed"
                          : selectedTime === time
                          ? "bg-yellow-500 text-black font-semibold"
                          : "bg-zinc-900 border border-white/10 hover:border-yellow-500"
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            )}

            {selectedTime && (
              <div className="mt-10 flex justify-end">
                <Button
                  onClick={() => setStep(4)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8"
                >
                  CONTINUE
                </Button>
              </div>
            )}
          </>
        )}

        {step === 4 && selectedService && selectedDate && selectedTime && (
          <>
            <button onClick={() => setStep(3)} className="text-sm text-yellow-500 mb-6 hover:underline">
              ← Back
            </button>
            <h2 className="text-3xl font-light tracking-[0.15em] mb-2">YOUR DETAILS</h2>
            <div className="w-12 h-0.5 bg-yellow-500 mb-4"></div>
            <p className="text-gray-400 mb-8">
              {selectedService.name} · {selectedDate} · {selectedTime}
            </p>

            <div className="space-y-5 max-w-md">
              <div>
                <label className="block text-xs tracking-wider text-gray-500 mb-2">FULL NAME *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/20 px-4 py-3 text-white focus:border-yellow-500 outline-none"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider text-gray-500 mb-2">EMAIL *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/20 px-4 py-3 text-white focus:border-yellow-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider text-gray-500 mb-2">PHONE (OPTIONAL)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/20 px-4 py-3 text-white focus:border-yellow-500 outline-none"
                  placeholder="021 123 4567"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                onClick={handleBooking}
                disabled={isSubmitting}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-6 mt-4"
              >
                {isSubmitting ? "BOOKING..." : "CONFIRM BOOKING"}
              </Button>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-3xl font-light tracking-[0.15em] mb-4">BOOKING CONFIRMED</h2>
            <div className="w-12 h-0.5 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-400 mb-2">Thank you, {customerName}</p>
            <p className="text-yellow-500 text-lg mb-10">
              {selectedService?.name}
              <br />
              {selectedDate} at {selectedTime}
            </p>
            <Link href="/my-bookings">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8">
                VIEW MY BOOKINGS
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}