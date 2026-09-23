import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-3">ABOUT US</h1>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The story behind Majha Salon
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl font-light tracking-[0.15em] mb-6">OUR STORY</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                At Majha Salon, we believe that grooming is more than just a service — it is an art form.
                Founded on the principles of precision, style and exceptional customer care, we have been
                setting the standard for men&apos;s grooming excellence.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Every client who walks through our doors receives personal attention and a tailored
                experience. From classic cuts to modern styles, our barbers combine traditional techniques
                with contemporary trends.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-500"></span>
                  <span className="text-gray-300">Expert craftsmen with years of experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-500"></span>
                  <span className="text-gray-300">Premium products and professional tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-500"></span>
                  <span className="text-gray-300">A refined atmosphere designed for relaxation</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "15+", label: "Years Experience" },
                { value: "10K+", label: "Happy Clients" },
                { value: "5.0", label: "Average Rating" },
                { value: "100%", label: "Satisfaction" },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900 border border-white/5 p-6 text-center">
                  <p className="text-3xl font-light text-yellow-500 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/book">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-10">
                BOOK APPOINTMENT
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
