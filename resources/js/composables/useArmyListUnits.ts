import { computed, ref } from 'vue'
import { UNITS, UNITS_BY_ID } from '../data/units'
import type { ArmyList } from '../types/army-list'

export type UnitEntry = {
    id: number
    quantity: number
}

export function useArmyListUnits(armyList: ArmyList) {
    const units = ref<UnitEntry[]>(armyList.units.map(u => ({ ...u })))

    const unitsInfo = computed(() => {
        return units.value.map(u => {
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

    function add(unitId: number, quantity = 1) {
        const existing = units.value.find(v => v.id === unitId)
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
        const existing = units.value.find(v => v.id === unitId)
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
        units.value = units.value.filter(v => v.id !== unitId)
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
