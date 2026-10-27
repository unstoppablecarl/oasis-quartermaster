import { computed, inject, type InjectionKey, provide, toRef } from 'vue'
import type { Command } from '../../data/commands'
import { type FactionId, FACTIONS } from '../../data/factions'
import type { UnitId } from '../../data/units'
import { hasValidationMessages, isCoreArmyListValid, validateArmyList, validateUnitInList } from '../lib/army-list-validation'
import {
    ARMY_LIST_TYPES_BY_ID,
    COMMANDS_BY_ID,
    FACTIONS_BY_ID,
    getArmyListMaxPoints,
    getArmyListMaxUnits,
} from '../lib/static-data-helpers'
import type { LocalArmyList } from '../types/army-list'
import { type UnitEntryInfo, useUnitsInfo } from './useUnitsInfo'

export function useArmyList(armyList: LocalArmyList) {
    const units = toRef(armyList, 'units')
    const maxPoints = computed(() => getArmyListMaxPoints(armyList))
    const maxUnits = computed(() => getArmyListMaxUnits(armyList))

    const { unitsInfo: baseUnitsInfo, totalCost, unitCount } = useUnitsInfo(units)

    const faction = computed(() => FACTIONS_BY_ID[armyList.faction_id])
    const commands = computed(() =>
        armyList.commands.map((c) => COMMANDS_BY_ID[c.id]),
    )
    const armyListTypeName = computed(() => getArmyListTypeName(armyList))

    const createdAt = computed(() => toTimestamp(armyList.created_at))
    const updatedAt = computed(() => toTimestamp(armyList.updated_at))

    function add(unitId: UnitId, quantity = 1) {
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

    function reorder(orderedUnitIds: UnitId[]) {
        const byId = new Map(units.value.map((unit) => [unit.id, unit]))

        units.value = orderedUnitIds
            .map((id) => byId.get(id))
            .filter((unit) => unit !== undefined)
    }

    const unitsInfo = computed(() =>
        baseUnitsInfo.value.map((u) => {
            const validation = validateUnitInList(armyList, u)

            return {
                ...u,
                validation,
                isValid: !hasValidationMessages(validation),
            }
        }),
    )

    const unitsWithIssues = computed(() =>
        unitsInfo.value.filter((u) => !u.isValid),
    )

    const validation = computed(() => validateArmyList(armyList))

    const valid = computed(
        () =>
            isCoreArmyListValid(validation.value.core) &&
            !validation.value.faction.length &&
            !unitsWithIssues.value.length,
    )

    return {
        armyList,
        unitsInfo,
        validation,
        valid,
        unitsWithIssues,
        totalCost,
        unitCount,
        add,
        subtract,
        remove,
        reorder,
        maxPoints,
        maxUnits,
        faction,
        commands,
        armyListTypeName,
        createdAt,
        updatedAt,
        unitCards: computed(() => getUnitCards(baseUnitsInfo.value)),
        commandCards: computed(() => getCommandCards(commands.value)),
        factionCards: computed(() => getFactionCards(armyList.faction_id)),
    }
}

export type ArmyListContext = ReturnType<typeof useArmyList>

const armyListKey: InjectionKey<ArmyListContext> = Symbol('armyList')

export function provideArmyList(armyList: LocalArmyList): ArmyListContext {
    const context = useArmyList(armyList)
    provide(armyListKey, context)

    return context
}

/**
 * Use the army list context provided by an ancestor page.
 */
export function injectArmyList(): ArmyListContext {
    const context = inject(armyListKey)
    if (!context) {
        throw new Error(
            'injectArmyList() must be used within a component that called provideArmyList()',
        )
    }

    return context
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
    if (factionId === FACTIONS.UNAFFILIATED.id) {
        return []
    }
    const faction = FACTIONS_BY_ID[factionId]
    return [
        {
            display_name: faction.display_name,
            side: 'Front',
            cardImage: faction.card_front!,
            type: 'Faction',
        },
        // {
        //     display_name: faction.display_name,
        //     side: 'Back',
        //     cardImage: faction.card_back!,
        //     type: 'Faction',
        // },
    ]
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
