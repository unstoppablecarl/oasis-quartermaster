export type Ability = {
    display_name: string,
    matcher?: RegExp,
}
export const ABILITIES: Record<string, Ability> = {
    ARMORED: {
        display_name: 'Armored',
    },
    EMBARK_DISEMBARK: {
        display_name: 'Embark / Disembark',
    },
    HITCHHIKER: {
        display_name: 'Hitchhiker',
    },
    JUMP_PACKS: {
        display_name: 'Jump Packs',
    },
    PRECISION: {
        display_name: 'Precision [Air / Ground / Squad]',
        matcher: /^Precision\b/i,
    },
    REMOTE_SURVEYOR: {
        display_name: 'Remote Surveyor',
    },
    REPOSITION: {
        display_name: 'Reposition [X"]',
        matcher: /^Reposition(\s+\d+")?$/i,
    },
    REPOSITION_FIXED_WING: {
        display_name: 'Reposition: Fixed Wing [X"]',
        matcher: /^Reposition:?\s*Fixed Wing(\s+\d+")?$/i,
    },
    SMOKE_GRENADES: {
        display_name: 'Smoke Grenades [X]',
        matcher: /^Smoke Grenades(\s*\(\d+\))?$/i,
    },
    SURGICAL_PRECISION: {
        display_name: 'Surgical Precision [Air / Ground / Squad]',
        matcher: /^Surgical Precision\b/i,
    },
    SURVEYOR: {
        display_name: 'Surveyor',
    },
    TARGET_DESIGNATOR: {
        display_name: 'Target Designator',
    },
    TRANSPORT_SALVAGE: {
        display_name: 'Transport [Salvage]',
        matcher: /^Transport\s*\(?\s*Salvage\s*\)?$/i,
    },
    TRANSPORT: {
        display_name: 'Transport [X]',
        matcher: /^Transport(\s*\(\d+\))?$/i,
    },
    WEAPON_CYCLING: {
        display_name: 'Weapon Cycling',
    },
    FLEXIBLE_DEPLOYMENT: {
        display_name: 'Flexible Deployment',
    },
    DUAL_CORE: {
        display_name: 'Dual Core',
    },
    MOMENTUM: {
        display_name: 'Momentum',
    },
    UPARMORED_GLACIS: {
        display_name: 'Uparmored Glacis',
    },
    NETWORKED_AUTOMATION: {
        display_name: 'Networked Automation',
    },
    AP: {
        display_name: 'AP',
    },
    SPLASH: {
        display_name: 'Splash',
    },
    AIR: {
        display_name: 'Air',
    },
    GND: {
        display_name: 'GND',
    },
    INDIRECT_FIRE: {
        display_name: 'Indirect Fire',
    },
    CLUMSY: {
        display_name: 'Clumsy',
    },
    INDEPENDENT: {
        display_name: 'Independent',
    },
    CLOSE_QUARTERS: {
        display_name: 'Close Quarters',
    },
    CQC_SPECIALIST: {
        display_name: 'CQC Specialist',
    },
}

export type Trait = {
    display_name: string,
    matcher?: RegExp,
}
export const TRAITS: Record<string, Trait> = {
    AIRCRAFT: {
        display_name: 'Aircraft',
    },
    AIRCRAFT_FIXED_WING: {
        display_name: 'Aircraft - Fixed Wing',
    },
    SQUAD: {
        display_name: 'Squad',
    },
    GRAV_DRIVE: {
        display_name: 'Grav Drive',
    },
    MODULAR_PAYLOAD: {
        display_name: 'Modular Payload',
    },
    ESCORT: {
        display_name: 'Escort [X"]',
        matcher: /^Escort(\s*\(\d+”\))?$/i,
    },
    REPAIR_SYSTEMS: {
        display_name: 'Repair Systems',
    },
    ACTIVE_COUNTERMEASURES: {
        display_name: 'Active Countermeasures',
    },
}

function matchesEntry(entry: { display_name: string, matcher?: RegExp }, value: string): boolean {
    if (entry.matcher) {
        return entry.matcher.test(value)
    }
    return entry.display_name.toLowerCase() === value.toLowerCase()
}

export function findAbilityOrTrait(raw: string): { key: string, display_name: string, type: 'ability' | 'trait' } | undefined {
    const value = raw.trim()

    for (const [key, entry] of Object.entries(ABILITIES)) {
        if (matchesEntry(entry, value)) {
            return { key, display_name: entry.display_name, type: 'ability' }
        }
    }

    for (const [key, entry] of Object.entries(TRAITS)) {
        if (matchesEntry(entry, value)) {
            return { key, display_name: entry.display_name, type: 'trait' }
        }
    }

    return undefined
}
