export type Faction = {
    id: number
    display_name: string
    card_front: string
    card_back: string
}

export const FACTIONS = {
    UNAFFILIATED: {
        id: 1,
        display_name: 'Unaffiliated (Default)',
        card_front: 'Unaffiliated.png',
        card_back: 'Faction Card Back.png',
    },
    IRON_RAIN: {
        id: 2,
        display_name: 'Iron Rain',
        card_front: 'IronRain.png',
        card_back: 'Faction Card Back.png',
    },
    FREELANCE: {
        id: 3,
        display_name: 'Freelance',
        card_front: 'Freelance.png',
        card_back: 'Faction Card Back.png',
    },
    SURVEYFI: {
        id: 4,
        display_name: 'SurveyFI',
        card_front: 'SurveyFI.png',
        card_back: 'Faction Card Back.png',
    },
} as const satisfies Record<string, Faction>

export type FactionId = (typeof FACTIONS)[keyof typeof FACTIONS]['id']

