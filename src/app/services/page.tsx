"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { Scissors, Sparkles, Droplets, Star } from "lucide-react"
import { createClient } from "@/lib/supabase"

const icons = [
  <Scissors key="scissors" className="w-6 h-6 text-yellow-500" />,
  <Sparkles key="sparkles" className="w-6 h-6 text-yellow-500" />,
  <Droplets key="droplets" className="w-6 h-6 text-yellow-500" />,
  <Star key="star1" className="w-6 h-6 text-yellow-500" />,
  <Star key="star2" className="w-6 h-6 text-yellow-500" />,
]

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name")

      if (error) {
        console.error("Services error:", error.message)
      }

      setServices(data ?? [])
      setLoading(false)
    }

    load()
  }, [])

  function formatPrice(price: number | string | null) {
    return `$${Number(price || 0).toFixed(0)}`
  }

  function formatDuration(service: any) {
    const minutes = service.duration_minutes || service.duration
    if (!minutes) return ""
    return `${minutes} min`
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-3">
              OUR SERVICES
            </h1>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Elevate your grooming routine with our range of premium services
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500">No services yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className="bg-zinc-900/80 border border-white/5 p-8 hover:border-yellow-500/40 transition"
                >
                  <div className="w-12 h-12 border border-yellow-500/50 flex items-center justify-center mb-5">
                    {icons[i % icons.length]}
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl tracking-wider">
                      {String(service.name || "").toUpperCase()}
                    </h3>
                    <span className="text-yellow-500 text-lg">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {service.description || "Premium grooming service."}
                  </p>
                  <p className="text-xs text-gray-500 tracking-wider">
                    {formatDuration(service)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10"
              >
                BOOK APPOINTMENT
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}