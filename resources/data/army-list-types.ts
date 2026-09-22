export type ArmyListType = {
    id: number,
    display_name: string,
    max_points: number
}

export const ARMY_LIST_TYPES: Record<string, ArmyListType> = {
    SALVAGE: {
        id: 1,
        display_name: 'Standard Salvage',
        max_points: 400,
    },
}

export const ARMY_LIST_TYPES_BY_ID = Object.fromEntries(Object.values(ARMY_LIST_TYPES).map(v => {
    return [v.id, v]
}))

if (import.meta?.env?.DEV) {
    const ids: number[] = []
    for (const [key, item] of Object.entries(ARMY_LIST_TYPES)) {

        if (ids.includes(item.id)) {
            throw new Error(`duplicate army list type id: ${item.id}`)
        }

        ids.push(item.id)
    }
}
