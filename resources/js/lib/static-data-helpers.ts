import { ARMY_LIST_TYPES, type ArmyListType, type ArmyListTypeId } from '../../data/army-list-types'
import { type Command, type CommandId, COMMANDS } from '../../data/commands'
import { type Faction, type FactionId, FACTIONS } from '../../data/factions'
import { type Unit, type UnitId, UNITS } from '../../data/units'
import type { UnitEntry } from '../types/army-list'

export const FACTIONS_BY_ID = Object.values(FACTIONS).reduce(
    (acc, faction) => {
        acc[faction.id] = faction
        return acc
    },
    {} as Record<FactionId, Faction>,
)

export const UNITS_BY_ID = Object.values(UNITS).reduce(
    (acc, unit) => {
        acc[unit.id] = unit
        return acc
    },
    {} as Record<UnitId, Unit>,
)

export const COMMANDS_BY_ID: Record<CommandId, Command> = Object.values(
    COMMANDS,
).reduce(
    (acc, command) => {
        acc[command.id] = command
        return acc
    },
    {} as Record<CommandId, Command>,
)

export const ARMY_LIST_TYPES_BY_ID = Object.values(ARMY_LIST_TYPES).reduce(
    (acc, armyListType) => {
        acc[armyListType.id] = armyListType
        return acc
    },
    {} as Record<ArmyListTypeId, ArmyListType>,
)

export function getFactionName(id: FactionId) {
    return FACTIONS_BY_ID[id]?.display_name ?? ''
}

export const unitCardColor = (file: string) =>
    `/images/cards/units-color/${file}`

export const unitCardBlackWhite = (file: string) =>
    `/images/cards/units-black-white/${file}`

export const factionCardColor = (file: string) =>
    `/images/cards/factions-color/${file}`

export const factionCardBlackWhite = (file: string) =>
    `/images/cards/factions-black-white/${file}`

export const commandCardColor = (file: string) =>
    `/images/cards/commands-color/${file}`

export const commandCardBlackWhite = (file: string) =>
    `/images/cards/commands-black-white/${file}`

export const CARD_DEFAULT_WIDTH = 300

export function getUnitFullName(id: UnitId) {
    return [
        UNITS_BY_ID[id].display_name,
        UNITS_BY_ID[id].class,
    ]
        .filter(Boolean)
        .join(' ')
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

export function getArmyListTotalPoints(armyList: { units: UnitEntry[] }) {
    let total = 0
    for (const u of armyList.units) {
        const unit = UNITS_BY_ID[u.id]

        total += u.quantity * unit.cost
    }

    return total
}

export function getArmyListUnitCount(armyList: { units: UnitEntry[] }) {
    return armyList.units.reduce((count, u) => count + u.quantity, 0)
}
