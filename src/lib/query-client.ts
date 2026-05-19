import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const QUERY_STALE_TIME = 30_000
export const QUERY_RETRY = 1

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        retry: QUERY_RETRY,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
        },
      },
    },
  })
}
