import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { UNITS_BY_ID } from '../../data/units'

export type UnitEntry = {
    id: number
    quantity: number
}

export type LocalArmyList = {
    display_name: string
    units: UnitEntry[]
    army_list_type_id: number | null
    custom_max_points: number | null
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
