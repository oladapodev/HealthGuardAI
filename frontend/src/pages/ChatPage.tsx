import * as React from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { PaperPlaneTiltIcon, ArrowClockwiseIcon, SparkleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ai, errorMessage } from "@/lib/logger"
import type { ChatMessage, ChatResponse } from "@/lib/types"

export default function ChatPage() {
  const navigate = useNavigate()
  const [input, setInput]   = React.useState("")
  const [sessionId, setSId] = React.useState<string | null>(null)
  const [messages, setMsgs] = React.useState<ChatMessage[]>([])
  const [actions, setActions] = React.useState<string[]>([])
  const [analysisId, setAnalysisId] = React.useState<string | null>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const onSuccess = (body: ChatResponse) => {
    ai.chatOk(summariseChat(body))
    setSId(body.conversationId)
    setActions(body.suggestedActions ?? [])
    setMsgs(prev => [...prev, {
      id: Date.now().toString(), role: "assistant",
      content: body.message, createdAt: new Date().toISOString(),
    }])
    if (body.analysis?.id) {
      setAnalysisId(body.analysis.id)
      toast.success("Analysis ready. View results?", {
        action: { label: "View", onClick: () => navigate(`/results/${body.analysis!.id}`) },
      })
    }
  }

  const onError = (err: unknown) => {
    ai.chatFail(err)
    toast.error(errorMessage(err))
  }

  const sendFirst = tsr.chat.send.useMutation({ onSuccess: ({ body }) => onSuccess(body), onError })
  const sendMore  = tsr.chat.sendMessage.useMutation({ onSuccess: ({ body }) => onSuccess(body), onError })

  const isPending = sendFirst.isPending || sendMore.isPending

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = (override?: string) => {
    const text = (override ?? input).trim()
    if (!text || isPending) return
    setInput("")
    setActions([])
    textareaRef.current?.focus()

    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: "user",
      content: text, createdAt: new Date().toISOString(),
    }
    setMsgs(prev => [...prev, userMsg])
    ai.chatSend({ sessionId, textLength: text.length })

    if (!sessionId) {
      sendFirst.mutate({ body: { text, intent: "chat" } })
    } else {
      sendMore.mutate({ params: { id: sessionId }, body: { text, intent: "chat" } })
    }
  }

  const reset = () => { setMsgs([]); setSId(null); setInput(""); setActions([]); setAnalysisId(null) }

  const SUGGESTIONS = [
    "I've been feeling tired lately",
    "Explain what hemoglobin means",
    "What should I ask my doctor?",
  ]

  return (
    // Fill the flex parent provided by AppLayout's chat-specific container
    <div className="flex flex-col flex-1 min-h-0">

      {/* Page header */}
      <div className="flex items-center justify-between pb-3 shrink-0">
        <div>
          <h1 className="font-heading text-xl font-bold">Chat</h1>
          <p className="text-xs text-muted-foreground">Educational only. Seek care for urgent symptoms.</p>
        </div>
        <div className="flex items-center gap-2">
          {analysisId && (
            <Button size="sm" variant="outline" className="text-xs gap-1.5"
              onClick={() => navigate(`/results/${analysisId}`)}>
              <SparkleIcon size={12} weight="fill" /> View results
            </Button>
          )}
          {messages.length > 0 && (
            <button onClick={reset} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <ArrowClockwiseIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pb-2">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-5 text-center pt-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ChatTeardropBubble />
              </div>
              <p className="text-muted-foreground text-sm">Ask anything about your health</p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {SUGGESTIONS.map(s => (
                  <motion.button key={s} onClick={() => send(s)}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="text-sm text-left px-4 py-2.5 rounded-xl border border-border hover:bg-accent hover:border-primary/30 transition-colors">
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((m) => (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm shadow-sm",
                )}>
                  {m.content}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isPending && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:120ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:240ms]" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested action chips */}
      <AnimatePresence>
        {actions.length > 0 && (
          <motion.div key="actions"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="shrink-0 flex flex-wrap gap-1.5 py-2">
            {actions.slice(0, 4).map(a => (
              <button key={a} onClick={() => send(a === "run_analysis" ? "run analysis" : a)}
                className="text-xs bg-accent border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                {actionLabel(a)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="shrink-0 pt-2 border-t border-border">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about your health…"
            className="resize-none min-h-[44px] max-h-28 text-sm"
            rows={1}
          />
          <Button size="icon" onClick={() => send()} disabled={!input.trim() || isPending}
            className="shrink-0 size-11 rounded-xl">
            {isPending ? <Spinner className="size-4" /> : <PaperPlaneTiltIcon size={18} weight="fill" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Not medical advice. For clinician review.
        </p>
      </div>
    </div>
  )
}

function ChatTeardropBubble() {
  return (
    <svg width="22" height="22" viewBox="0 0 256 256" className="text-primary fill-current">
      <path d="M128 28C69.8 28 22 70.6 22 123c0 29.3 13.7 55.7 35.5 73.7L48 228l40.2-17.5A115.3 115.3 0 00128 218c58.2 0 106-42.6 106-95S186.2 28 128 28Z" opacity="0.3"/>
      <path d="M128 24C67.6 24 18 68 18 123c0 30.8 14.4 58.5 37.4 77.7l-10.3 35.7a4 4 0 005.2 4.9l42.3-18.4A118 118 0 00128 226c60.4 0 110-44 110-103S188.4 24 128 24Zm0 198c-13.4 0-26.3-2.3-38.4-6.7a4 4 0 00-3 .2L53 231.3l8.7-30.2a4 4 0 00-1.3-4.2C40.6 179.7 26 152.7 26 123 26 72.4 72.2 32 128 32s102 40.4 102 91-46.2 99-102 99Z"/>
    </svg>
  )
}

function summariseChat(body: ChatResponse) {
  return {
    conversationId: body.conversationId,
    readyForAnalysis: body.readyForAnalysis,
    hasAnalysis: Boolean(body.analysis?.id),
  }
}

function actionLabel(action: string): string {
  return action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}
