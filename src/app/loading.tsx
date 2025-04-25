export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded-full bg-emerald-500"></div>
          <div className="h-5 w-5 animate-pulse rounded-full bg-emerald-500" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-5 w-5 animate-pulse rounded-full bg-emerald-500" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-sm text-gray-500">Processing your request...</p>
      </div>
    </div>
  );
} 