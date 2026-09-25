import { ARMY_LIST_TYPES, type ArmyListType, type ArmyListTypeId } from '../../data/army-list-types'
import { type Command, type CommandId, COMMANDS } from '../../data/commands'
import { type Faction, type FactionId, FACTIONS } from '../../data/factions'
import { type Unit, type UnitId, UNITS } from '../../data/units'

export const FACTIONS_BY_ID = Object.values(FACTIONS).reduce((acc, faction) => {
    acc[faction.id] = faction
    return acc
}, {} as Record<FactionId, Faction>)

export const UNITS_BY_ID = Object.values(UNITS).reduce((acc, unit) => {
    acc[unit.id] = unit
    return acc
}, {} as Record<UnitId, Unit>)

export const COMMANDS_BY_ID = Object.values(COMMANDS).reduce((acc, command) => {
    acc[command.id] = command
    return acc
}, {} as Record<CommandId, Command>)

export const ARMY_LIST_TYPES_BY_ID = Object.values(ARMY_LIST_TYPES).reduce((acc, armyListType) => {
    acc[armyListType.id] = armyListType
    return acc
}, {} as Record<ArmyListTypeId, ArmyListType>)

export function getFactionName(id: FactionId) {
    return FACTIONS_BY_ID[id]?.display_name ?? ''
}

export const unitCardColor = (file: string) => `/images/cards/units-color/${file}`

export const unitCardBlackWhite = (file: string) => `/images/cards/units-black-white/${file}`


export const factionCardColor = (file: string) => `/images/cards/factions-color/${file}`

export const factionCardBlackWhite = (file: string) => `/images/cards/factions-black-white/${file}`

export const commandCardColor = (file: string) => `/images/cards/commands-color/${file}`

export const commandCardBlackWhite = (file: string) => `/images/cards/commands-black-white/${file}`

export const CARD_DEFAULT_WIDTH = 300
