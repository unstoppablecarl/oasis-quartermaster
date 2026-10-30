export type Command = {
    id: number
    display_name: string
    card_front: string
    card_back: string
}

export const COMMANDS = {
    FIREPOWER: {
        id: 1,
        display_name: 'Firepower',
        card_front: 'Firepower.jpg',
        card_back: 'Command Card Back.jpg',
    },
    GENERALIST: {
        id: 2,
        display_name: 'Generalist',
        card_front: 'Generalist.jpg',
        card_back: 'Command Card Back.jpg',
    },
    MOBILITY: {
        id: 3,
        display_name: 'Mobility',
        card_front: 'Mobility.jpg',
        card_back: 'Command Card Back.jpg',
    },
    SURVEYOR: {
        id: 4,
        display_name: 'Surveyor',
        card_front: 'Surveyor.jpg',
        card_back: 'Command Card Back.jpg',
    },
    SURVIVE: {
        id: 5,
        display_name: 'Survivability',
        card_front: 'Survive.jpg',
        card_back: 'Command Card Back.jpg',
    },
} as const satisfies Record<string, Command>

export type CommandId = (typeof COMMANDS)[keyof typeof COMMANDS]['id']
