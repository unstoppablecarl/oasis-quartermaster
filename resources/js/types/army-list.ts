export type ArmyList = {
    uuid: string
    display_name: string
    army_list_type_id: number | null
    custom_max_points: number | null
    public: boolean
    faction_id: FactionId,
    units: {
        id: number
        quantity: number
    }[]
    can: {
        update: boolean
        delete: boolean
    };
};
