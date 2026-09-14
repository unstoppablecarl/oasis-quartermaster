import { computed, type MaybeRefOrGetter, ref, toValue } from 'vue'
import { ARMY_LIST_TYPES_BY_ID } from '../../data/army-list-types'
import { type UnitEntry, useUnitsInfo } from './useUnitsInfo'

export type { UnitEntry }

export function useArmyList(initialUnits: UnitEntry[] = []) {
    const units = ref<UnitEntry[]>(initialUnits.map((u) => ({ ...u })))

    const { unitsInfo, totalCost } = useUnitsInfo(units)

    function add(unitId: number, quantity = 1) {
        const existing = units.value.find((v) => v.id === unitId)
        if (existing) {
            existing.quantity += quantity
            return
        }

        units.value.push({
            id: unitId,
            quantity,
        })
    }

    function subtract(unitId: number, quantity = 1) {
        const existing = units.value.find((v) => v.id === unitId)
        if (!existing) {
            return
        }

        if (existing.quantity <= quantity) {
            existing.quantity = 0
            return
        }

        existing.quantity -= quantity
    }

    function remove(unitId: number) {
        units.value = units.value.filter((v) => v.id !== unitId)
    }

    return {
        units,
        unitsInfo,
        totalCost,
        add,
        subtract,
        remove,
    }
}

export function computedArmyListMaxPoints(
    armyList: MaybeRefOrGetter<{
        army_list_type_id: number | null
        custom_max_points: number | null
    }>,
) {
    return computed(() => getArmyListMaxPoints(toValue(armyList)))
}

export function getArmyListMaxPoints(armyList: {
    army_list_type_id: number | null
    custom_max_points: number | null
}): number | null {
    if (armyList.army_list_type_id === null) {
        return armyList.custom_max_points
    }

    return ARMY_LIST_TYPES_BY_ID[armyList.army_list_type_id]?.max_points ?? null
}

export function getArmyListTypeName(armyList: {
    army_list_type_id: number | null
}) {
    if (armyList.army_list_type_id === null) {
        return 'Custom'
    }
    return ARMY_LIST_TYPES_BY_ID[armyList.army_list_type_id]?.display_name
}
