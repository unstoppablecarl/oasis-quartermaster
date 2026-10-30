import { TRAITS } from '../../data/abilities-and-traits'
import { type FactionId, FACTIONS } from '../../data/factions'
import type { Unit, UnitId } from '../../data/units'
import type { LocalArmyList, UnitEntry } from '../types/army-list'
import { unitHasTrait, UNITS_BY_ID } from './static-data-helpers'

type FactionValidator = {
    validateUnitAllowed?: (unit: Unit) => string[]
    validateUnitInList?: (armyList: LocalArmyList, entry: UnitEntry) => string[]
    validateArmyList?: (armyList: LocalArmyList) => string[]
}

const FACTION_VALIDATORS_BY_ID: Record<FactionId, FactionValidator> = {
    [FACTIONS.UNAFFILIATED.id]: {},
    [FACTIONS.IRON_RAIN.id]: (() => {
        const traits = [
            TRAITS.GRAV_DRIVE.display_name,
            TRAITS.AIRCRAFT_HEAVY_GRAV_DRIVE.display_name,
        ]

        return {
            validateUnitAllowed: (unit: Unit) => {
                const hasRequiredTrait = unit.traits.some((trait) => traits.includes(trait))
                if (hasRequiredTrait) {
                    return []
                }

                return [`All Units must have the ${traits.join(' or ')} Trait`]
            },
        }
    })(),
    [FACTIONS.FREELANCE.id]: {
        validateUnitInList: (armyList: LocalArmyList, entry: UnitEntry) => {
            if (entry.quantity <= 2) {
                return []
            }

            return [`You may not have more than 2 units of any type (veterans still count as the same unit type)`]
        },
    },
    [FACTIONS.SURVEYFI.id]: {
        validateUnitAllowed: (unit: Unit) => {
            if ((unit.hp ?? 0) <= 4) {
                return []
            }

            return [`You may not have any Units with more than 4 HP`]
        },
        validateArmyList: (armyList: LocalArmyList) => {
            let surveyorUnitTotalCost = 0

            for (const entry of armyList.units) {
                if (unitHasTrait(entry.id, 'SURVEYOR')) {
                    const unit = UNITS_BY_ID[entry.id]
                    surveyorUnitTotalCost += entry.quantity * unit.cost
                }
            }

            const requiredSurveyorPoints = 150

            const pointsValid = surveyorUnitTotalCost >= requiredSurveyorPoints
            if (pointsValid) {
                return []
            }

            return [
                `Units with the Surveyor Trait must total at least 150 points.`,
                `Required Surveyor Trait Unit points: (${surveyorUnitTotalCost} / ${requiredSurveyorPoints})`,
            ]
        },
    },
}

export const FACTION_VALIDATOR = {
    validateUnitAllowed(factionId: FactionId, unitId: UnitId): string[] {
        return FACTION_VALIDATORS_BY_ID[factionId].validateUnitAllowed?.(UNITS_BY_ID[unitId]) ?? []
    },
    validateUnitInList(armyList: LocalArmyList, entry: UnitEntry): string[] {
        const validator = FACTION_VALIDATORS_BY_ID[armyList.faction_id]

        return [
            ...(validator.validateUnitAllowed?.(UNITS_BY_ID[entry.id]) ?? []),
            ...(validator.validateUnitInList?.(armyList, entry) ?? []),
        ]
    },
    validateArmyList(armyList: LocalArmyList): string[] {
        return FACTION_VALIDATORS_BY_ID[armyList.faction_id].validateArmyList?.(armyList) ?? []
    },
}
