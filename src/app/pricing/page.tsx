"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { createClient } from "@/lib/supabase"

type Service = {
  id: string
  name: string
  price: number
  duration?: number
  duration_minutes?: number
  time?: number
  description?: string
}

export default function PricingPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("services").select("*")

      if (!error && data) {
        setServices(data as Service[])
      }
      setLoading(false)
    }

    load()
  }, [supabase])

  function getMinutes(service: Service) {
    return service.duration || service.duration_minutes || service.time || 0
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-3">
              PRICING
            </h1>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-400">
              Choose the service that suits your grooming needs
            </p>
          </div>

          {loading && (
            <p className="text-center text-gray-500">Loading prices...</p>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`bg-zinc-950 p-8 flex flex-col ${
                  index === 1
                    ? "border-2 border-yellow-500 relative"
                    : "border border-white/10"
                }`}
              >
                {index === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-4 py-1 tracking-wider">
                    POPULAR
                  </span>
                )}

                <h3 className="text-lg tracking-widest mb-1 uppercase">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {getMinutes(service)} minutes
                </p>
                {service.description && (
                  <p className="text-gray-400 text-sm mb-6">{service.description}</p>
                )}
                <p className="text-5xl font-light text-yellow-500 mb-8">
                  ${service.price}
                </p>

                <div className="flex-1" />

                <Link href="/book">
                  <Button
                    className={`w-full ${
                      index === 1
                        ? "bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                        : "border border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    }`}
                  >
                    BOOK NOW
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}