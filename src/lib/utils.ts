import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes, resolving conflicts with the last class winning.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
