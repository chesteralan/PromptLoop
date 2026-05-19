import { Copy, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

interface StreamingTextProps {
  text: string
  isStreaming: boolean
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  const { scrollRef } = useAutoScroll(text)
  const { copied, copy } = useCopyToClipboard()

  if (!text && !isStreaming) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Waiting for execution to start...
      </div>
    )
  }

  return (
    <div className="relative rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">Response</span>
        <div className="flex items-center gap-2">
          {text && (
            <Button variant="ghost" size="icon-sm" onClick={() => copy(text)}>
              {copied ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          )}
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-blue-500">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-blue-500" />
              Streaming
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="h-80">
        <div ref={scrollRef} className="overflow-y-auto p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{text}</pre>
          {isStreaming && (
            <span className="inline-block size-2 animate-pulse rounded-full bg-blue-500" />
          )}
        </div>
      </ScrollArea>

      {text && (
        <div className="border-t px-4 py-1.5 text-xs text-muted-foreground">
          {text.length.toLocaleString()} chars
        </div>
      )}
    </div>
  )
}
