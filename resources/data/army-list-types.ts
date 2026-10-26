export type ArmyListType = {
    id: number
    display_name: string
    max_points: number
    max_units: number | null
}

export const ARMY_LIST_TYPES: Record<string, ArmyListType> = {
    SALVAGE: {
        id: 1,
        display_name: 'Standard Salvage',
        max_points: 400,
        max_units: 20,
    },
}

export type ArmyListTypeId =
    (typeof ARMY_LIST_TYPES)[keyof typeof ARMY_LIST_TYPES]['id']
