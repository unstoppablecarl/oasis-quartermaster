import type { UnitEntry } from '../composables/useUnitsInfo'

const STORAGE_KEY = 'oasis-army-list-draft'

export type ArmyListDraft = {
    display_name: string
    army_list_type_id: number | null
    custom_max_points: number | null
    units: UnitEntry[]
}

export function loadArmyListDraft(): ArmyListDraft | null {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)

        return raw ? (JSON.parse(raw) as ArmyListDraft) : null
    } catch {
        return null
    }
}

export function saveArmyListDraft(draft: ArmyListDraft): void {
    if (typeof window === 'undefined') {
        return
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
        // Ignore write failures, e.g. private browsing storage limits.
    }
}

export function clearArmyListDraft(): void {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.removeItem(STORAGE_KEY)
}
