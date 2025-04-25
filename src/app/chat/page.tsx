"use client"

import { ChatContainer } from "@/app/components/chat/container"
import { ChatInput } from "@/app/components/chat/input"
import { useMemo, useState, useEffect, useRef } from "react"
import { handleChatMessage } from "@/app/lib/ai/chat"
import type { MyUserMessage } from "@/baml_client"

export default function ChatPage() {
  const [messages, setMessages] = useState<MyUserMessage[]>(() => 
    typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem('chatMessages') || '[]') : []
  )
  
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasInitialMessage, setHasInitialMessage] = useState(false)

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Check for initial message from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMessages = localStorage.getItem('chatMessages')
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages)
        setHasInitialMessage(parsedMessages.length > 0)
      }
    }
  }, [])

  const formattedMessages = useMemo(() => {
    setIsLoading(false);
    return messages.map((message) => ({
      id: message.id || Date.now().toString(),
      role: message.role as "user" | "assistant",
      content: message.content,
    }))
  }, [messages])

  useEffect(() => {
    async function startChat() {
      if (!hasInitialMessage && messages.length === 0) {
        setIsLoading(true)
        setHasInitialMessage(true)
        
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const initialMessage = {
          role: 'assistant' as const,
          content: "Hello! Our records show that you currently owe $2400. Are you able to resolve this debt today?",
          id: Date.now().toString()
        }
        
        setMessages([initialMessage])
        
        // Save initial message to localStorage
        localStorage.setItem('chatMessages', JSON.stringify([initialMessage]))
      }
    }
    startChat()
  }, [hasInitialMessage, messages.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setError(null)
    
    try {
      // Create user message
      const userMessage = {
        role: 'user' as const,
        content: input,
        id: Date.now().toString()
      }
      
      // Add user message
      setMessages(prev => [...prev, userMessage])
      setInput('')
      scrollToBottom()

      // Get LLM response using all messages to retain context
      const allMessages = [...formattedMessages, userMessage]
      const llmResponse = await handleChatMessage(allMessages)

      // Add LLM response
      if (llmResponse) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: llmResponse,
          id: Date.now().toString()
        }])
        scrollToBottom()
      }
    } catch (error) {
      console.error('Error in chat submission:', error)
      setError(error instanceof Error ? error.message : 'Failed to process message')
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }
  
  const scrollToBottom = () => {
    const container = document.querySelector('[data-chat-container]')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-full flex flex-col">
      <div 
        data-chat-container
        className="flex-1 overflow-y-auto py-4"
      >
        <ChatContainer messages={formattedMessages} isLoading={isLoading} />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <ChatInput 
        value={input} 
        onChange={handleInputChange} 
        onSubmit={handleChatSubmit} 
        isLoading={isLoading} 
      />
    </div>
  )
}
