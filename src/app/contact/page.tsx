import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-3">CONTACT</h1>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-400">Get in touch with Majha Salon</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm tracking-[0.2em] text-yellow-500 mb-2">ADDRESS</h3>
                <p className="text-gray-300">123 Main Street<br />Your City, New Zealand</p>
              </div>
              <div>
                <h3 className="text-sm tracking-[0.2em] text-yellow-500 mb-2">PHONE</h3>
                <p className="text-gray-300">021 123 4567</p>
              </div>
              <div>
                <h3 className="text-sm tracking-[0.2em] text-yellow-500 mb-2">EMAIL</h3>
                <p className="text-gray-300">hello@majhasalon.co.nz</p>
              </div>
              <div>
                <h3 className="text-sm tracking-[0.2em] text-yellow-500 mb-2">OPENING HOURS</h3>
                <p className="text-gray-300">
                  Monday – Friday: 9:00 AM – 6:00 PM<br />
                  Saturday: 9:00 AM – 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Simple Contact Form */}
            <div className="bg-zinc-950 border border-white/10 p-8">
              <h3 className="text-lg tracking-wider mb-6">SEND A MESSAGE</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs tracking-wider text-gray-500 mb-2">NAME</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-900 border border-white/20 px-4 py-3 text-white focus:border-yellow-500 outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider text-gray-500 mb-2">EMAIL</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-900 border border-white/20 px-4 py-3 text-white focus:border-yellow-500 outline-none"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider text-gray-500 mb-2">MESSAGE</label>
                  <textarea
                    rows={4}
                    className="w-full bg-zinc-900 border border-white/20 px-4 py-3 text-white focus:border-yellow-500 outline-none resize-none"
                    placeholder="Your message"
                  />
                </div>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-6">
                  SEND MESSAGE
                </Button>
              </div>
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
