interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  )
}