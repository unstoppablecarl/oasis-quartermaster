export type ArmyList = {
    uuid: string;
    display_name: string;
    units: {
        id: number;
        quantity: number;
    }[];
    can: {
        update: boolean;
        delete: boolean;
    };
};
