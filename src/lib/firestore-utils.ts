import { Timestamp } from 'firebase/firestore'

export function ts(d: Date): Timestamp {
  return Timestamp.fromDate(d)
}

export function fromTS(v: unknown): Date {
  if (v instanceof Timestamp) return v.toDate()
  if (v instanceof Date) return v
  return new Date()
}

export function optTS(v: unknown): Date | undefined {
  if (v == null) return undefined
  return fromTS(v)
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result
}
