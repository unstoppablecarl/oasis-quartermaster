import type { InertiaLinkProps } from '@inertiajs/vue3'
import { formatDistanceToNow } from 'date-fns'

export function toUrl(href: NonNullable<InertiaLinkProps['href']>) {
    return typeof href === 'string' ? href : href?.url;
}


export function chunk<T>(collection: T[], size: number): T[][] {
    let result = []

    for (let x = 0; x < Math.ceil(collection.length / size); x++) {
        let start = x * size
        let end = start + size

        result.push(collection.slice(start, end))
    }

    return result
}

export function timeAgo(val: Date | undefined | null) {
  if (!val) return null
  return formatDistanceToNow(val, { addSuffix: true })
}

export function localize(val: Date | undefined | null) {
  if (!val) return null

  return val.toLocaleDateString() + ' ' + val.toLocaleTimeString()
}

export function sort<T>(getter: (v: T) => number) {
    return (a: T, b: T): number => {
        return getter(a) - getter(b)
    }
}
