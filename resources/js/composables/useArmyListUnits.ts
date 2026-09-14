import { ref } from 'vue'
import { type UnitEntry, useUnitsInfo } from './useUnitsInfo'

export type { UnitEntry }

export function useArmyListUnits(initialUnits: UnitEntry[] = []) {
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
