import { type MaybeRefOrGetter, computed, toValue } from 'vue'
import { UNITS_BY_ID } from '../data/units'

export type UnitEntry = {
    id: number
    quantity: number
}

export function useUnitsInfo(units: MaybeRefOrGetter<UnitEntry[]>) {
    const unitsInfo = computed(() => {
        return toValue(units).map((u) => {
            return {
                ...u,
                ...UNITS_BY_ID[u.id],
            }
        })
    })

    const totalCost = computed(() => {
        let total = 0
        for (let i = 0; i < unitsInfo.value.length; i++) {
            const item = unitsInfo.value[i]
            total += item.quantity * item.cost
        }
        return total
    })

    return {
        unitsInfo,
        totalCost,
    }
}
