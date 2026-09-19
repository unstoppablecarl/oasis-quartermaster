import type { InertiaLinkProps } from '@inertiajs/vue3';

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
