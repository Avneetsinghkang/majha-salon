import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { Scissors, Sparkles, Droplets, Star } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600')] bg-cover bg-center opacity-40"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-light tracking-[0.15em] mb-2">
            MAJHA
          </h2>
          <h3 className="text-4xl md:text-6xl font-light tracking-[0.2em] text-yellow-500 mb-8">
            SALON
          </h3>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Where tradition meets innovation. Experience the art of grooming redefined
            with precision cuts, expert styling, and unparalleled service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10 py-4 text-base"
            >
              BOOK APPOINTMENT
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10 py-4 text-base"
            >
              VIEW SERVICES
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light tracking-[0.2em] mb-3">OUR SERVICES</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Elevate your grooming routine with our premium services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Scissors className="w-6 h-6 text-yellow-500" />,
                title: "SIGNATURE HAIRCUT",
                desc: "Precision cuts tailored to your style and personality."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
                title: "BEARD GROOMING",
                desc: "Expert beard trimming and shaping for a polished look."
              },
              {
                icon: <Droplets className="w-6 h-6 text-yellow-500" />,
                title: "HOT TOWEL SHAVE",
                desc: "Traditional wet shave with premium products."
              },
              {
                icon: <Star className="w-6 h-6 text-yellow-500" />,
                title: "STYLING & TREATMENT",
                desc: "Premium treatments and styling for lasting results."
              }
            ].map((service, i) => (
              <div key={i} className="bg-zinc-900/80 border border-white/5 p-8 hover:border-yellow-500/40 transition">
                <div className="w-12 h-12 border border-yellow-500/50 flex items-center justify-center mb-5">
                  {service.icon}
                </div>
                <h3 className="text-xl tracking-wider mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3"
            >
              VIEW ALL SERVICES
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light tracking-[0.15em] mb-4">BOOK YOUR APPOINTMENT</h2>
          <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-gray-400 mb-8">Schedule your visit and experience the art of grooming</p>
          <Link href="/book">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-12 py-6">
              BOOK NOW
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-zinc-950 border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg tracking-[0.2em]">MAJHA</h3>
            <p className="text-xs text-yellow-500 tracking-[0.3em]">SALON</p>
          </div>
          <p className="text-gray-600 text-sm">© 2026 Majha Salon. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}