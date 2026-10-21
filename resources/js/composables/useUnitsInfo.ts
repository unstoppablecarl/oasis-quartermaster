import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { type Unit } from '../../data/units'
import { UNITS_BY_ID } from '../lib/static-data-helpers'
import type { UnitEntry } from '../types/army-list'

export type UnitEntryInfo = UnitEntry & Unit

export function useUnitsInfo(units: MaybeRefOrGetter<UnitEntry[]>) {
    const unitsInfo = computed((): UnitEntryInfo[] => {
        return toValue(units).map((u) => {
            return {
                ...u,
                ...UNITS_BY_ID[u.id],
            } as UnitEntryInfo
        })
    })

    const totals = computed(() => {
        let cost = 0
        let count = 0
        for (let i = 0; i < unitsInfo.value.length; i++) {
            const item = unitsInfo.value[i]
            cost += item.quantity * item.cost
            count += item.quantity
        }
        return { cost, count }
    })

    const totalCost = computed(() => totals.value.cost)
    const unitCount = computed(() => totals.value.count)

    return {
        unitsInfo,
        totalCost,
        unitCount,
    }
}
