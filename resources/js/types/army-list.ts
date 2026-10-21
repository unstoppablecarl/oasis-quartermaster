import type { ArmyListTypeId } from '../../data/army-list-types'
import type { CommandId } from '../../data/commands'
import type { FactionId } from '../../data/factions'
import type { UnitId } from '../../data/units'

type Command = {
    id: CommandId
}

export type UnitEntry = {
    id: UnitId
    quantity: number
}

export type ArmyList = {
    uuid: string
    display_name: string
    army_list_type_id: number | null
    custom_max_points: number | null
    public: boolean
    faction_id: FactionId
    commands: Command[]
    created_at: string
    updated_at: string
    units: UnitEntry[]
    can: {
        update: boolean
        delete: boolean
    }
}

export type LocalArmyList = {
    uuid?: string
    created_at?: string
    updated_at?: string
    display_name: string
    faction_id: FactionId
    commands: Command[]
    units: UnitEntry[]
    army_list_type_id: ArmyListTypeId | null
    custom_max_points: number | null
    public: boolean
}
