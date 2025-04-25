"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { handleChatMessage } from "@/app/lib/ai/chat"

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Adjust height on value change
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set the height to match content (max 4 lines)
      const maxHeight = 24 * 4 // lineHeight * maxLines
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white p-4 sticky bottom-0">
      <div className="flex items-end rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          rows={1}
          placeholder="Type your message..."
          className="flex-1 min-h-[44px] max-h-[96px] resize-none border-0 bg-transparent py-3 px-3 focus:outline-none text-black overflow-y-auto"
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="p-3 text-teal-500 hover:text-teal-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  )
}
