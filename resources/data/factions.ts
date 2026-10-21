export type Faction = {
    id: number
    display_name: string
    card_front?: string
    card_back?: string
}

export const FACTIONS = {
    UNAFFILIATED: {
        id: 1,
        display_name: 'Unaffiliated (Default)',
    },
    IRON_RAIN: {
        id: 2,
        display_name: 'Iron Rain',
        card_front: 'IronRain.jpg',
        card_back: 'Faction Card Back.jpg',
    },
    FREELANCE: {
        id: 3,
        display_name: 'Freelance',
        card_front: 'Freelance.jpg',
        card_back: 'Faction Card Back.jpg',
    },
    SURVEYFI: {
        id: 4,
        display_name: 'SurveyFI',
        card_front: 'SurveyFi.jpg',
        card_back: 'Faction Card Back.jpg',
    },
} as const satisfies Record<string, Faction>

export type FactionId = (typeof FACTIONS)[keyof typeof FACTIONS]['id']
