export type Command = {
    id: number,
    display_name: string,
    card: string,
}

export const COMMANDS: Record<string, Command> = {
    FIREPOWER: {
        id: 1,
        display_name: 'Firepower',
        card: 'Firepower.png',
    },
    GENERALIST: {
        id: 2,
        display_name: 'Generalist',
        card: 'Generalist.png',
    },
    MOBILITY: {
        id: 3,
        display_name: 'Mobility',
        card: 'Mobility.png',
    },
    SURVEYOR: {
        id: 4,
        display_name: 'Surveyor',
        card: 'Surveyor.png',
    },
    SURVIVE: {
        id: 5,
        display_name: 'Survive',
        card: 'Survive.png',
    },
} satisfies Record<string, Command>

export type CommandId = (typeof COMMANDS)[keyof typeof COMMANDS]['id']

