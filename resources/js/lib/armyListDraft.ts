import { ARMY_LIST_TYPES } from '../../data/army-list-types'
import type { LocalArmyList } from '../composables/useUnitsInfo'
import type { ArmyList } from '../types/army-list'

const STORAGE_KEY = 'oasis-army-list-draft'

export function loadArmyListDraft(): LocalArmyList {
    const draft = makeDraft()
    if (typeof window === 'undefined') {
        return draft
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)

        const result = raw ? (JSON.parse(raw) as LocalArmyList) : null

        return {
            ...draft,
            ...result,
        }
    } catch {
        return draft
    }
}

export function hasArmyListDraft(): boolean {
    if (typeof window === 'undefined') {
        return false
    }
    return !!window.localStorage.getItem(STORAGE_KEY)
}

export function saveArmyListDraft(draft: LocalArmyList): void {
    if (typeof window === 'undefined') {
        return
    }

    draft = toLocalArmyList(draft)

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

function makeDraft(): LocalArmyList {
    const allArmyListTypes = Object.values(ARMY_LIST_TYPES)

    return {
        display_name: '',
        units: [],
        army_list_type_id: allArmyListTypes[0]?.id ?? null,
        custom_max_points: null,
        public: false,
    }
}

export function toLocalArmyList(armyList: ArmyList | LocalArmyList): LocalArmyList {
    return {
        display_name: armyList.display_name,
        units: armyList.units.map((u) => ({ ...u })),
        army_list_type_id: armyList.army_list_type_id,
        custom_max_points: armyList.custom_max_points,
        public: armyList.public,
    }
}
