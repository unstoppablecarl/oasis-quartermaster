import type { CommandId } from '../../data/commands'
import type { FactionId } from '../../data/factions'
import type { UnitId } from '../../data/units'

type Command = {
    id: CommandId
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
    units: {
        id: UnitId
        quantity: number
    }[]
    can: {
        update: boolean
        delete: boolean
    }
}
