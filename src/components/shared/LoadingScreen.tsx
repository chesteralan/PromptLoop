export function LoadingScreen({ message }: { message?: string } = {}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
