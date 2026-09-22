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
