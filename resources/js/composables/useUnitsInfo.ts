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

export function useUnitsInfo(units: MaybeRefOrGetter<UnitEntry[]>, maxPoints: MaybeRefOrGetter<number | null>) {
    const baseUnits = computed(() => {
        return toValue(units).map((u) => {
            return {
                ...u,
                ...UNITS_BY_ID[u.id],
            }
        })
    })

    const unitsInfo = computed(() => {
        return baseUnits.value.map((u) => {

            const cost = u.quantity * u.cost
            const count = u.quantity

            const resolvedMaxPoints = toValue(maxPoints)

            const validationMessages = []
            if (resolvedMaxPoints !== null && cost > resolvedMaxPoints * 0.5) {
                validationMessages.push(`Unit cost cannot be greater than 50% of Total Points. (${cost} / ${resolvedMaxPoints * 0.5})`)
            }
            const halfCount =  Math.ceil(unitCount.value * 0.5)

            if (count > halfCount) {
                validationMessages.push(`Unit count cannot be greater than 50% of Total Unit Count. (${count} / ${halfCount})`)
            }

            return {
                ...u,
                validationMessages,
            }
        })
    })

    const totals = computed(() => {
        let cost = 0
        let count = 0
        for (let i = 0; i < baseUnits.value.length; i++) {
            const item = baseUnits.value[i]
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

