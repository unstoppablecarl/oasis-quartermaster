import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { CommandId } from '../../data/commands'
import { type FactionId } from '../../data/factions'
import { type Unit, type UnitId } from '../../data/units'
import { UNITS_BY_ID } from '../lib/static-data-helpers'

export type UnitEntry = {
    id: UnitId
    quantity: number
}

export type UnitEntryInfo = UnitEntry & Unit & {
    validationMessages: string []
}

export type LocalArmyList = {
    uuid?: string
    display_name: string
    faction_id: FactionId
    commands: {id: CommandId}[]
    units: UnitEntry[]
    army_list_type_id: number | null
    custom_max_points: number | null
    public: boolean
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

    const unitsInfo = computed((): UnitEntryInfo[] => {
        return baseUnits.value.map((u) => {

            const cost = u.quantity * u.cost
            const count = u.quantity

            const resolvedMaxPoints = toValue(maxPoints)

            const validationMessages = []
            if (resolvedMaxPoints !== null && cost > resolvedMaxPoints * 0.5) {
                validationMessages.push(`Unit cost cannot be greater than 50% of Total Points. (${cost} / ${resolvedMaxPoints * 0.5})`)
            }
            const halfCount = Math.ceil(unitCount.value * 0.5)

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

