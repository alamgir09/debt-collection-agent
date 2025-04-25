"use client"

import { useRef, useEffect } from "react"
import { Message } from "./message"
import { TypingIndicator } from "./typing"
import type { MyUserMessage } from "@/app/lib/utils/types"

interface ContainerProps {
  messages: MyUserMessage[]
  isLoading: boolean
}

export function ChatContainer({ messages, isLoading }: ContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-500">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Welcome to CollectWise</h3>
            <p>How can I help with your debt collection questions today?</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}
    </div>
  )
}
