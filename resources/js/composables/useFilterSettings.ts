import { type MaybeRefOrGetter, reactive, toRef, toValue, watch } from 'vue'

type Settings = {
    showPrefix: boolean
    showManufacturer: boolean
    showClass: boolean
    filterWithinBudgetUnits: boolean
    filterFactionValidUnits: boolean
}

const STORAGE_KEY = 'oasis-army-list-filter-settings'

function make(): Settings {
    return {
        showPrefix: true,
        showManufacturer: true,
        showClass: true,
        filterWithinBudgetUnits: false,
        filterFactionValidUnits: false,
    }
}

export function loadSettings(): Settings {
    const draft = make()
    if (typeof window === 'undefined') {
        return draft
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)

        const result = raw ? (JSON.parse(raw) as Settings) : null

        return {
            ...draft,
            ...result,
        }
    } catch {
        return draft
    }
}

export function hasSettings(): boolean {
    if (typeof window === 'undefined') {
        return false
    }
    return !!window.localStorage.getItem(STORAGE_KEY)
}

export function saveSettings(draft: Settings): void {
    if (typeof window === 'undefined') {
        return
    }

    draft = toRawSettings(draft)

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
        // Ignore write failures, e.g. private browsing storage limits.
    }
}

export function toRawSettings(settings: MaybeRefOrGetter<Settings>): Settings {
    const s = toValue(settings)
    return {
        showPrefix: s.showPrefix,
        showManufacturer: s.showManufacturer,
        showClass: s.showClass,
        filterFactionValidUnits: s.filterFactionValidUnits,
        filterWithinBudgetUnits: s.filterWithinBudgetUnits,
    }
}

const settings = reactive(loadSettings())

watch(settings, (value) => {
    saveSettings(value)
})

export function useFilterSettings() {
    const showPrefix = toRef(settings, 'showPrefix')
    const showManufacturer = toRef(settings, 'showManufacturer')
    const showClass = toRef(settings, 'showClass')
    const filterWithinBudgetUnits = toRef(settings, 'filterWithinBudgetUnits')
    const filterFactionValidUnits = toRef(settings, 'filterFactionValidUnits')

    return {
        showPrefix,
        showManufacturer,
        showClass,
        filterWithinBudgetUnits,
        filterFactionValidUnits,
    }
}
