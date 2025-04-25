export function TypingIndicator() {
  return (
    <div className="bg-white text-emerald-900 max-w-[80%] rounded-lg p-4">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}