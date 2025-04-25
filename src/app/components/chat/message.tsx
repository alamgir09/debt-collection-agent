import type { MyUserMessage } from "@/app/lib/utils/types"

interface MessageProps {
  message: MyUserMessage
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 animate-fade-in ${
          isUser ? "bg-teal-500 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        {message.content || <div className="h-5 w-5 animate-pulse bg-muted-foreground/20 rounded"></div>}
      </div>
    </div>
  )
}
