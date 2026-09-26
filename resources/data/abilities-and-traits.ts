export type Ability = {
    display_name: string
    matcher?: RegExp
    valid_values?: string[]
}

export const ABILITIES: Record<string, Ability> = {
    EMBARK_DISEMBARK: {
        display_name: 'Embark / Disembark',
    },
    HITCHHIKER: {
        display_name: 'Hitchhiker',
    },
    PRECISION: {
        display_name: 'Precision [X]',
        matcher: /^Precision \[Air|Ground|Squad]\b/i,
    },
    REMOTE_SURVEYOR: {
        display_name: 'Remote Surveyor',
    },
    REPOSITION: {
        display_name: 'Reposition [X]',
        matcher: /^Reposition \[\d+]?$/i,
    },
    REPOSITION_FIXED_WING: {
        display_name: 'Reposition: Fixed Wing [X]',
        matcher: /^Reposition: Fixed Wing \[\d+]?$/i,
    },
    SMOKE_GRENADES: {
        display_name: 'Smoke Grenades [X]',
        matcher: /^Smoke Grenades \[\d+]?$/i,
    },
    TARGET_DESIGNATOR: {
        display_name: 'Target Designator',
    },
    WEAPON_CYCLING: {
        display_name: 'Weapon Cycling: X',
        matcher: /^Weapon Cycling: .*?$/i,
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
    INDEPENDENT: {
        display_name: 'Independent',
    },
    CLOSE_QUARTERS: {
        display_name: 'Close Quarters',
    },
    CQC_SPECIALIST: {
        display_name: 'CQC Specialist',
    },
    ACTIVE_COUNTERMEASURES: {
        display_name: 'Active Countermeasures',
    },
    ESCORT: {
        display_name: 'Escort [X]',
        matcher: /^Escort \[\d+]?$/i,
    },
    MODULAR_PAYLOAD: {
        display_name: 'Modular Payload',
    },
    REPAIR_SYSTEMS: {
        display_name: 'Repair Systems',
    },
    SMART_BURST_ROUNDS: {
        display_name: 'Smartburst Rounds',
    },
}

export type Trait = {
    display_name: string
    matcher?: RegExp
}
export const TRAITS: Record<string, Trait> = {
    ARMORED: {
        display_name: 'Armored',
    },
    SURVEYOR: {
        display_name: 'Surveyor',
    },
    AIRCRAFT: {
        display_name: 'Aircraft',
    },
    AIRCRAFT_FIXED_WING: {
        display_name: 'Aircraft: Fixed Wing',
    },
    AIRCRAFT_VTOL: {
        display_name: 'Aircraft: VTOL',
    },
    AIRCRAFT_HEAVY_GRAV_DRIVE: {
        display_name: 'Aircraft: Heavy Grav Drive',
    },
    SQUAD: {
        display_name: 'Squad',
    },
    GRAV_DRIVE: {
        display_name: 'Grav Drive',
    },
    Q_CRAFT: {
        display_name: 'Q-Craft',
    },
    NETWORKED_AUTOMATION: {
        display_name: 'Networked Automation',
    },
    LARGE_CRAFT_DEGRADATION: {
        display_name: 'Large Craft: Degradation',
    },
    CLUMSY: {
        display_name: 'CLUMSY',
    },
    TRANSPORT_SALVAGE: {
        display_name: 'Transport [Salvage]',
    },
    HEAVY_LIFT_TRANSPORT: {
        display_name: 'Heavy Lift Transport [X]',
        matcher: /^Heavy Lift Transport \[\d+]?$/i,
    },
    TRANSPORT: {
        display_name: 'Transport [X]',
        matcher: /^Transport \[\d+]?$/i,
    },
    LASER_DAZZLER: {
        display_name: 'Laser Dazzler',
    },
    JUMP_PACKS: {
        display_name: 'Jump Packs',
    },
}

function matchesEntry(
    entry: { display_name: string; matcher?: RegExp },
    value: string,
): boolean {
    if (entry.matcher) {
        return entry.matcher.test(value)
    }
    return entry.display_name.toLowerCase() === value.toLowerCase()
}

type Finder = (raw: string) => { key: string; display_name: string } | undefined

function findAbility(
    raw: string,
): { key: string; display_name: string } | undefined {
    return find(ABILITIES, raw)
}

function findTrait(
    raw: string,
): { key: string; display_name: string } | undefined {
    return find(TRAITS, raw)
}

function find<T extends Record<string, any>>(
    target: T,
    raw: string,
):
    | {
          key: string
          display_name: string
      }
    | undefined {
    const value = raw.trim()

    for (const [key, entry] of Object.entries(target)) {
        if (matchesEntry(entry, value)) {
            return { key, display_name: entry.display_name }
        }
    }

    return undefined
}

type UnitRows = Record<
    string,
    { display_name: string; abilities: string[]; traits: string[] }
>

function unmatchedToStrLines(unmatched: Map<any, any>) {
    return [...unmatched.entries()]
        .map(([raw, unitNames]) => `  "${raw}" (${[...unitNames].join(', ')})`)
        .join('\n')
}

export function validateUnits(rows: UnitRows) {
    let lines = ''

    const unmatchedAbilities = findUnmatched(rows, 'abilities', findAbility)
    if (unmatchedAbilities.size) {
        lines += `Found ${unmatchedAbilities.size} ability value(s) in the CSV that don't match anything in ABILITIES:\n${unmatchedToStrLines(unmatchedAbilities)}`
    }

    const unmatchedTraits = findUnmatched(rows, 'traits', findTrait)
    if (unmatchedTraits.size) {
        lines += `\nFound ${unmatchedTraits.size} trait value(s) in the CSV that don't match anything in TRAITS:\n${unmatchedToStrLines(unmatchedTraits)}`
    }

    if (lines.length) {
        throw new Error(lines)
    }
}

function findUnmatched(
    rows: UnitRows,
    key: 'abilities' | 'traits',
    finder: Finder,
) {
    const unmatched = new Map()

    for (const unit of Object.values(rows)) {
        for (const raw of unit[key]) {
            const match = finder(raw)

            if (!match) {
                if (!unmatched.has(raw)) {
                    unmatched.set(raw, new Set())
                }
                unmatched.get(raw).add(unit.display_name)
            }
        }
    }

    return unmatched
}
