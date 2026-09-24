import { computed, toRef, toValue } from 'vue'
import { getArmyListFactionValidator } from '../lib/faction-validators'
import { ARMY_LIST_TYPES_BY_ID, COMMANDS_BY_ID, FACTIONS_BY_ID, UNITS_BY_ID } from '../lib/static-data-helpers'
import type { ArmyList } from '../types/army-list'
import { type LocalArmyList, type UnitEntry, type UnitEntryInfo, useUnitsInfo } from './useUnitsInfo'

export type { UnitEntry }

export function useArmyList(armyList: LocalArmyList) {
    const units = toRef(armyList, 'units')
    const maxPoints = computed(() => getArmyListMaxPoints(toValue(armyList)))

    const { unitsInfo, totalCost, unitCount } = useUnitsInfo(units, maxPoints)

    const faction = computed(() => FACTIONS_BY_ID[armyList.faction_id])
    const commands = computed(() => armyList.commands.map(c => COMMANDS_BY_ID[c.id]))
    const armyListTypeName = computed(() => getArmyListTypeName(armyList))

    const createdAt = computed(() => toTimestamp(armyList.created_at))
    const updatedAt = computed(() => toTimestamp(armyList.updated_at))

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

    const unitsInfoFinal = computed(() => {
        const validator = getArmyListFactionValidator(armyList.faction_id)
        return unitsInfo.value.map(u => {
            return {
                ...u,
                factionValidation: validator.validateUnitInList(armyList, u),
            }
        })
    })

    return {
        unitsInfo: unitsInfoFinal,
        totalCost,
        unitCount,
        add,
        subtract,
        remove,
        reorder,
        maxPoints,
        faction,
        commands,
        armyListTypeName,
        createdAt,
        updatedAt,
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

function toTimestamp(val: string | undefined) {
    if (!val) {
        return null
    }
    return new Date(val)
}

export function getArmyListTotalPoints(armyList: Pick<ArmyList, 'units'>) {
    let total = 0
    for (const u of armyList.units) {
        const unit = UNITS_BY_ID[u.id]

        total += u.quantity * unit.cost
    }

    return total
}
