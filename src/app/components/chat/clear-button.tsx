"use client"

import { Trash2 } from "lucide-react"

export function ClearChatButton() {
  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat? This will start a new conversation.")) {
      localStorage.removeItem('chatMessages')
      window.location.reload()
    }
  }

  return (
    <button 
      onClick={clearChat}
      className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1.5 hover:bg-teal-600 rounded-lg transition-colors"
      title="Clear chat history"
    >
      <span className="hidden sm:inline">Clear Chat</span>
      <Trash2 className="w-4 h-4" />
    </button>
  )
} 