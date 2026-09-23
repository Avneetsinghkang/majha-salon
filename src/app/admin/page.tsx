"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"

const STATUSES = ["confirmed", "completed", "cancelled"] as const
const ADMIN_EMAIL = "jobankang7005@gmail.com"

export default function AdminPage() {
  const supabase = createClient()

  const [allowed, setAllowed] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_minutes: "",
    description: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser()
      const email = data.user?.email?.toLowerCase()

      if (!email || email !== ADMIN_EMAIL.toLowerCase()) {
        window.location.href = "/admin/login"
        return
      }

      setAllowed(true)
    }

    checkAdmin()
  }, [])

  async function loadAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        start_time,
        end_time,
        status,
        services (
          name,
          price
        )
      `)
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Supabase error:", error.message)
    }

    setAppointments(data ?? [])
  }

  async function loadServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("name")

    if (error) {
      console.error("Services error:", error.message)
    }

    setServices(data ?? [])
  }

  useEffect(() => {
    if (!allowed) return

    async function load() {
      await Promise.all([loadAppointments(), loadServices()])
      setLoading(false)
    }
    load()
  }, [allowed])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-NZ", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-NZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  async function updateStatus(id: string, status: string) {
    setSavingId(id)
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    }
    setSavingId(null)
  }

  function startEdit(service: any) {
    setEditingId(service.id)
    setForm({
      name: service.name ?? "",
      price: service.price != null ? String(service.price) : "",
      duration_minutes:
        service.duration_minutes != null ? String(service.duration_minutes) : "",
      description: service.description ?? "",
    })
    setMessage("Editing: " + service.name)
    document.getElementById("service-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm({
      name: "",
      price: "",
      duration_minutes: "",
      description: "",
    })
    setMessage("")
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")

    const payload: any = {
      name: form.name.trim(),
      price: Number(form.price),
    }

    if (form.duration_minutes) {
      payload.duration_minutes = Number(form.duration_minutes)
    }
    if (form.description) {
      payload.description = form.description
    }

    const { error } = editingId
      ? await supabase.from("services").update(payload).eq("id", editingId)
      : await supabase.from("services").insert(payload)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(editingId ? "Service updated." : "Service added.")
    resetForm()
    loadServices()
  }

  async function deleteService(service: any) {
    const ok = confirm(`Delete "${service.name}"?`)
    if (!ok) return

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id)

    if (error) {
      alert(error.message)
      return
    }

    if (editingId === service.id) {
      resetForm()
    }

    loadServices()
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-500">Checking admin access...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-light tracking-[0.2em]">MAJHA SALON</h1>
            <p className="text-xs tracking-[0.3em] text-yellow-500">ADMIN</p>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white hover:text-black"
            >
              Back to Site
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-light tracking-[0.15em] mb-2">APPOINTMENTS</h2>
        <div className="w-12 h-0.5 bg-yellow-500 mb-10"></div>

        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="border border-white/10 bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-lg tracking-wide">{appt.customer_name}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {appt.services?.name || "Service"} · $
                    {Number(appt.services?.price || 0).toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {appt.customer_email}
                    {appt.customer_phone ? ` · ${appt.customer_phone}` : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-yellow-500 tracking-wider">
                    {formatDate(appt.start_time)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                  </p>
                  <select
                    value={appt.status || "confirmed"}
                    disabled={savingId === appt.id}
                    onChange={(e) => updateStatus(appt.id, e.target.value)}
                    className="mt-2 bg-black border border-white/20 text-yellow-500 text-xs px-3 py-1"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-3xl font-light tracking-[0.15em] mt-16 mb-2">SERVICES</h2>
        <div className="w-12 h-0.5 bg-yellow-500 mb-10"></div>

        <form
          id="service-form"
          onSubmit={saveService}
          className="border border-white/10 bg-zinc-950 p-6 mb-8 grid gap-4 sm:grid-cols-2"
        >
          <input
            required
            placeholder="Service name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-black border border-white/20 px-3 py-2"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="bg-black border border-white/20 px-3 py-2"
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={form.duration_minutes}
            onChange={(e) =>
              setForm({ ...form, duration_minutes: e.target.value })
            }
            className="bg-black border border-white/20 px-3 py-2"
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-black border border-white/20 px-3 py-2"
          />
          <div className="sm:col-span-2 flex gap-3">
            <Button
              type="submit"
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              {editingId ? "Update service" : "Add service"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-white/20 bg-transparent text-white"
              >
                Cancel edit
              </Button>
            )}
          </div>
          {message && (
            <p className="sm:col-span-2 text-sm text-yellow-500">{message}</p>
          )}
        </form>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-white/10 bg-zinc-950 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p>{service.name}</p>
                <p className="text-sm text-gray-400">
                  ${Number(service.price || 0).toFixed(0)}
                  {service.duration_minutes
                    ? ` · ${service.duration_minutes} min`
                    : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white hover:text-black"
                  onClick={() => startEdit(service)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-700 bg-transparent text-red-400 hover:bg-red-900/40"
                  onClick={() => deleteService(service)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}