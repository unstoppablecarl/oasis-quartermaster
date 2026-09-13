export type ArmyList = {
    uuid: string;
    display_name: string;
    can: {
        update: boolean;
        delete: boolean;
    };
};
