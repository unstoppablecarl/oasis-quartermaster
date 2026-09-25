import { computed, toRef, toValue } from 'vue'
import type { Command } from '../../data/commands'
import type { FactionId } from '../../data/factions'
import { getArmyListFactionValidator } from '../lib/faction-validators'
import {
    ARMY_LIST_TYPES_BY_ID,
    COMMANDS_BY_ID,
    FACTIONS_BY_ID,
    UNITS_BY_ID,
} from '../lib/static-data-helpers'
import type { ArmyList } from '../types/army-list'
import {
    type LocalArmyList,
    type UnitEntry,
    type UnitEntryInfo,
    useUnitsInfo,
} from './useUnitsInfo'

export type { UnitEntry }

export function useArmyList(armyList: LocalArmyList) {
    const units = toRef(armyList, 'units')
    const maxPoints = computed(() => getArmyListMaxPoints(toValue(armyList)))

    const { unitsInfo, totalCost, unitCount } = useUnitsInfo(units, maxPoints)

    const faction = computed(() => FACTIONS_BY_ID[armyList.faction_id])
    const commands = computed(() =>
        armyList.commands.map((c) => COMMANDS_BY_ID[c.id]),
    )
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

        units.value = orderedUnitIds
            .map((id) => byId.get(id))
            .filter((unit) => unit !== undefined)
    }

    const unitsInfoFinal = computed(() => {
        const validator = getArmyListFactionValidator(armyList.faction_id)
        return unitsInfo.value.map((u) => {
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
        commandCards: computed(() => getCommandCards(commands.value)),
        factionCards: computed(() => getFactionCards(armyList.faction_id)),
    }
}

export type CardSide = 'Front' | 'Back'
export type CardType = 'Unit' | 'Command' | 'Faction'
export type Card = {
    display_name: string
    side: CardSide
    cardImage: string
    type: CardType
}

export function getUnitCards(unitsInfo: UnitEntryInfo[]): Card[] {
    const output: Card[] = []

    const type = 'Unit'
    for (const unit of unitsInfo) {
        const display_name = unit.display_name
        for (const front of unit.cards_front) {
            output.push({
                display_name,
                side: 'Front',
                cardImage: front,
                type,
            })
        }
        if (!unit.cards_front.length) {
            output.push({
                display_name,
                side: 'Front',
                cardImage: '',
                type,
            })
        }
        output.push({
            display_name,
            side: 'Back',
            cardImage: unit.card_back,
            type,
        })
    }

    return output
}

export function getCommandCards(commands: Command[]): Card[] {
    const output: Card[] = []
    const type = 'Command'
    for (const item of commands) {
        const display_name = item.display_name
        output.push({
            display_name,
            side: 'Front',
            cardImage: item.card_front,
            type,
        })

        output.push({
            display_name,
            side: 'Back',
            cardImage: item.card_back,
            type,
        })
    }

    return output
}

export function getFactionCards(factionId: FactionId): Card[] {
    const faction = FACTIONS_BY_ID[factionId]
    return [
        {
            display_name: faction.display_name,
            side: 'Front',
            cardImage: faction.card_front!,
            type: 'Faction',
        },
        {
            display_name: faction.display_name,
            side: 'Back',
            cardImage: faction.card_back!,
            type: 'Faction',
        },
    ]
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
