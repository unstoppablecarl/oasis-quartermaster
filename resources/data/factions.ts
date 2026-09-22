export type Faction = {
    id: number,
    display_name: string,
    card: string | null,
}

export const FACTIONS = {
    UNAFFILIATED: {
        id: 1,
        display_name: 'Unaffiliated (Default)',
        card: null
    },
    IRON_RAIN: {
        id: 2,
        display_name: 'Iron Rain',
        card: 'IronRain.png'
    },
    FREELANCE: {
        id: 3,
        display_name: 'Freelance',
        card: 'Freelance.png'
    },
    SURVEYFI: {
        id: 4,
        display_name: 'SurveyFI',
        card: 'SurveyFI.png'
    },
} as const satisfies Record<string, Faction>

export type FactionId = (typeof FACTIONS)[keyof typeof FACTIONS]['id']
