import type { InertiaLinkProps } from '@inertiajs/vue3'
import type { LucideIcon } from '@lucide/vue'
import type { Component } from 'vue'

export type NavItem = {
    title: string
    href: NonNullable<InertiaLinkProps['href']>
    icon?: LucideIcon | Component
    isActive?: boolean
    children?: NavItem[]
    visible?: () => boolean
}
