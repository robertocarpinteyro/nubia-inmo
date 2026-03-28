"use client"
import { useEffect, useRef, useState } from "react"
import { useAuth, API_BASE_URL } from "@/context/AuthContext"
import DashboardLayout from "@/components/dashboard/common/DashboardLayout"

interface Message { id: number; role: "user" | "assistant"; content: string; createdAt: string }

const AiChatPage = () => {
   const { getAuthHeaders } = useAuth()
   const [messages, setMessages] = useState<Message[]>([])
   const [input, setInput] = useState("")
   const [sending, setSending] = useState(false)
   const bottomRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      fetch(`${API_BASE_URL}/vendor/ai-chat`, {
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      })
         .then((r) => r.json())
         .then((d) => setMessages(Array.isArray(d) ? d : []))
         .catch(() => {})
   }, [])

   useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

   const send = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return
      setSending(true)
      const userMsg = input.trim()
      setInput("")
      setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: userMsg, createdAt: new Date().toISOString() }])

      try {
         const res = await fetch(`${API_BASE_URL}/vendor/ai-chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
            body: JSON.stringify({ message: userMsg }),
         })
         const data = await res.json()
         if (data.reply) {
            setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: data.reply, createdAt: new Date().toISOString() }])
         }
      } catch {
         setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: "Lo siento, el asistente no está disponible en este momento.", createdAt: new Date().toISOString() }])
      } finally {
         setSending(false)
      }
   }

   return (
      <DashboardLayout title="Chat AI" allowedRoles={["vendedor"]}>
         <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="nubia-dash-card" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", minHeight: 500 }}>
               <div className="card-head">
                  <h5 className="card-title">
                     <i className="bi bi-stars me-2" style={{ color: "#7B4FFF" }}></i>
                     Asistente NUBIA AI
                  </h5>
                  <span className="nubia-badge gray">Beta</span>
               </div>

               {/* Messages */}
               <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {messages.length === 0 && (
                     <div style={{ textAlign: "center", padding: "48px 24px", color: "rgba(0,0,0,0.3)" }}>
                        <i className="bi bi-stars" style={{ fontSize: 40, display: "block", marginBottom: 16 }}></i>
                        <p style={{ margin: 0 }}>Pregúntame sobre propiedades, comisiones, estrategias de venta o leads.</p>
                     </div>
                  )}
                  {messages.map((m) => (
                     <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                        <div style={{
                           maxWidth: "78%",
                           padding: "12px 16px",
                           borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                           background: m.role === "user" ? "#7B4FFF" : "#f5f5f2",
                           color: m.role === "user" ? "#fff" : "#0C0C0C",
                           fontSize: 14,
                           lineHeight: 1.6,
                        }}>
                           {m.content}
                        </div>
                     </div>
                  ))}
                  {sending && (
                     <div style={{ display: "flex" }}>
                        <div style={{ background: "#f5f5f2", padding: "12px 16px", borderRadius: "12px 12px 12px 4px", color: "rgba(0,0,0,0.4)", fontSize: 14 }}>
                           Escribiendo…
                        </div>
                     </div>
                  )}
                  <div ref={bottomRef} />
               </div>

               {/* Input */}
               <form onSubmit={send} style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 10 }}>
                  <input
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Escribe tu pregunta..."
                     style={{ flex: 1, padding: "12px 16px", background: "#f5f5f2", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, fontSize: 14, color: "#0C0C0C", outline: "none", fontFamily: "Gordita, sans-serif" }}
                     disabled={sending}
                  />
                  <button type="submit" className="btn-nubia-sm primary" disabled={sending || !input.trim()}>
                     <i className="bi bi-send"></i>
                  </button>
               </form>
            </div>
         </div>
      </DashboardLayout>
   )
}

export default AiChatPage
