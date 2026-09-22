import { computed, toRef, toValue } from 'vue'
import { ARMY_LIST_TYPES_BY_ID } from '../../data/army-list-types'
import { FACTIONS_BY_ID } from '../lib/static-data-helpers'
import { type LocalArmyList, type UnitEntry, type UnitEntryInfo, useUnitsInfo } from './useUnitsInfo'

export type { UnitEntry }

export function useArmyList(armyList: LocalArmyList) {
    const units = toRef(armyList, 'units')
    const maxPoints = computed(() => getArmyListMaxPoints(toValue(armyList)))

    const { unitsInfo, totalCost, unitCount } = useUnitsInfo(units, maxPoints)

    const faction = computed(() => FACTIONS_BY_ID[armyList.faction_id])

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

    function reorder(orderedUnitIds: number[]) {
        const byId = new Map(units.value.map((unit) => [unit.id, unit]))

        units.value = orderedUnitIds.map((id) => byId.get(id)).filter((unit) => unit !== undefined)
    }

    return {
        unitsInfo,
        totalCost,
        unitCount,
        add,
        subtract,
        remove,
        reorder,
        maxPoints,
        faction,
        unitCards: computed(() => getUnitCards(unitsInfo.value)),
    }
}

export type UnitCard = {
    display_name: string
    type: 'Front' | 'Back'
    cardImage: string
}

export function getUnitCards(unitsInfo: UnitEntryInfo[]): UnitCard[] {
    const output: UnitCard[] = []

    for (const unit of unitsInfo) {
        const display_name = unit.display_name
        for (const front of unit.cards_front) {
            output.push({
                display_name,
                type: 'Front',
                cardImage: front,
            })
        }
        if (!unit.cards_front.length) {
            output.push({
                display_name,
                type: 'Front',
                cardImage: '',
            })
        }
        output.push({
            display_name,
            type: 'Back',
            cardImage: unit.card_back,
        })
    }

    return output
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

