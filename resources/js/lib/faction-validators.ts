import { ABILITIES, TRAITS } from '../../data/abilities-and-traits'
import { type FactionId, FACTIONS } from '../../data/factions'
import type { UnitId } from '../../data/units'
import { getArmyListMaxPoints, type UnitEntry } from '../composables/useArmyList'
import type { LocalArmyList } from '../composables/useUnitsInfo'
import type { ArmyList } from '../types/army-list'
import { UNITS_BY_ID } from './static-data-helpers'

export const FACTION_VALIDATORS_BY_ID: Record<FactionId, FactionValidator> = {
    [FACTIONS.UNAFFILIATED.id]: {
        validateArmyList: () => [],
        validateUnitInList: () => undefined,
        validateUnitCandidate: () => undefined,
    },
    [FACTIONS.IRON_RAIN.id]: (() => {
        const traits = [
            TRAITS.GRAV_DRIVE.display_name,
            TRAITS.AIRCRAFT_HEAVY_GRAV_DRIVE.display_name,
        ]

        function validateUnitCandidate(armyList: LocalArmyList, id: UnitId) {
            const unit = UNITS_BY_ID[id]
            const valid = unit.traits.find((v) => traits.includes(v))
            if (!valid) {
                return {
                    id,
                    alwaysInvalid: true,
                    validationMessages: [`All Units must have the ${traits.join(' or ')} Trait`],
                }
            }
        }

        function validateUnitInList(armyList: LocalArmyList, unit: UnitEntry) {
            const result = validateUnitCandidate(armyList, unit.id)
            if (result) {
                return {
                    ...result,
                    quantity: unit.quantity,
                }
            }
        }

        return {
            validateArmyList: () => [],
            validateUnitInList,
            validateUnitCandidate,
        }
    })(),
    [FACTIONS.FREELANCE.id]: (() => {
        function validateUnitInList(armyList: LocalArmyList, u: UnitEntry) {
            if (u.quantity > 1) {
                return {
                    id: u.id,
                    quantity: u.quantity,
                    alwaysInvalid: false,
                    validationMessages: [`You may not have more than 2 units of any type (veterans still count as the same unit type)`],
                }
            }
        }

        return {
            validateArmyList: () => [],
            validateUnitInList,
            validateUnitCandidate: () => undefined,
        }
    })(),
    [FACTIONS.SURVEYFI.id]: (() => {

        function validateUnitCandidate(armyList: LocalArmyList, id: UnitId) {
            const unit = UNITS_BY_ID[id]
            const hp = unit.hp ?? 0

            if (hp > 4) {
                return {
                    id,
                    alwaysInvalid: true,
                    validationMessages: [`You may not have any Units with more than 4 HP`],
                }
            }
        }

        function validateUnitInList(armyList: LocalArmyList, unit: UnitEntry) {
            const result = validateUnitCandidate(armyList, unit.id)
            if (result) {
                return {
                    ...result,
                    quantity: unit.quantity,
                }
            }
        }

        return {
            validateArmyList: (armyList: LocalArmyList) => {
                const unitCount = armyList.units.reduce((c, v) => c + v.quantity, 0)
                let surveyorUnitCount = 0
                const maxPoints = getArmyListMaxPoints(armyList)
                let surveyorUnitTotalCost = 0

                for (const u of armyList.units) {
                    const unit = UNITS_BY_ID[u.id]
                    const isSurveyor = unit.abilities.includes(ABILITIES.SURVEYOR.display_name)
                    if (isSurveyor) {
                        surveyorUnitCount += u.quantity
                        surveyorUnitTotalCost += u.quantity * unit.cost
                    }
                }

                let validationMessages = []
                let halfPointsValid = false
                let halfPoints: number | null = null
                if (maxPoints !== null) {
                    halfPoints = Math.ceil(maxPoints * 0.5)
                    halfPointsValid = surveyorUnitTotalCost >= halfPoints
                    if (!halfPointsValid) {
                        validationMessages.push(`Required Surveyor Trait Unit points: (${surveyorUnitTotalCost} / ${halfPoints})`)
                    }
                }

                const halfCount = Math.ceil(unitCount * 0.5)
                const halfCountValid = surveyorUnitCount >= halfCount

                if (!halfCountValid) {
                    validationMessages.push(`Required Surveyor Trait Unit count. (${surveyorUnitCount} / ${halfCount})`)
                }

                if (validationMessages.length) {
                    validationMessages = [
                        `At least 50% of the total Units cost or Units count must be Units with the Surveyor Trait.`,
                        ...validationMessages,
                    ]
                }

                return validationMessages
            },
            validateUnitInList,
            validateUnitCandidate,
        }
    })(),
}

type FactionUnitEntry = {
    id: UnitId,
    quantity: number,
    alwaysInvalid: boolean
    validationMessages: string[],
}

export type UnitInListValidationResult = Exclude<ReturnType<FactionValidator['validateUnitInList']>, undefined>

type FactionValidator = {
    validateArmyList: (armyList: LocalArmyList) => string[],
    validateUnitInList: (armyList: LocalArmyList, unit: UnitEntry) => FactionUnitEntry | undefined,
    validateUnitCandidate: (armyList: LocalArmyList, unitId: UnitId) => Omit<FactionUnitEntry, 'quantity'> | undefined,
}

export function getArmyListFactionValidator(factionId: FactionId) {
    return FACTION_VALIDATORS_BY_ID[factionId ?? FACTIONS.UNAFFILIATED.id]
}

export function validateArmyListFaction(armyList: ArmyList) {
    return FACTION_VALIDATORS_BY_ID[armyList.faction_id].validateArmyList(armyList)
}

export function validateArmyListFactionUnit(armyList: ArmyList, unit: UnitEntry) {
    return FACTION_VALIDATORS_BY_ID[armyList.faction_id].validateUnitInList(armyList, unit)
}
