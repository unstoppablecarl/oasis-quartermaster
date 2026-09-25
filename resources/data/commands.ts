export type Command = {
    id: number
    display_name: string
    card_front: string
    card_back: string
}

export const COMMANDS: Record<string, Command> = {
    FIREPOWER: {
        id: 1,
        display_name: 'Firepower',
        card_front: 'Firepower.png',
        card_back: 'Cmd Card Back.png',
    },
    GENERALIST: {
        id: 2,
        display_name: 'Generalist',
        card_front: 'Generalist.png',
        card_back: 'Cmd Card Back.png',
    },
    MOBILITY: {
        id: 3,
        display_name: 'Mobility',
        card_front: 'Mobility.png',
        card_back: 'Cmd Card Back.png',
    },
    SURVEYOR: {
        id: 4,
        display_name: 'Surveyor',
        card_front: 'Surveyor.png',
        card_back: 'Cmd Card Back.png',
    },
    SURVIVE: {
        id: 5,
        display_name: 'Survive',
        card_front: 'Survive.png',
        card_back: 'Cmd Card Back.png',
    },
} satisfies Record<string, Command>

export type CommandId = (typeof COMMANDS)[keyof typeof COMMANDS]['id']

