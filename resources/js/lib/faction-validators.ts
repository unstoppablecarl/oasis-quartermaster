import { TRAITS } from '../../data/abilities-and-traits'
import { type FactionId, FACTIONS } from '../../data/factions'
import type { UnitId } from '../../data/units'
import { getArmyListMaxPoints } from '../composables/useArmyList'
import type { ArmyList } from '../types/army-list'
import { UNITS_BY_ID } from './static-data-helpers'

export const FACTION_VALIDATORS_BY_ID: Record<FactionId, FactionValidator> = {
    [FACTIONS.UNAFFILIATED.id]: () => ({
        validationMessages: [],
        units: [],
    }),
    [FACTIONS.IRON_RAIN.id]: (armyList: ArmyList) => {
        const results = []

        const traits = [
            TRAITS.GRAV_DRIVE.display_name,
            TRAITS.AIRCRAFT_HEAVY_GRAV_DRIVE.display_name,
        ]
        for (const u of armyList.units) {
            const unit = UNITS_BY_ID[u.id]
            const valid = unit.traits.find((v) => traits.includes(v))

            if (!valid) {
                results.push({
                    id: u.id,
                    quantity: u.quantity,
                    validationMessages: [`All Units must have the ${traits.join(' or ')} Trait`],
                })
            }
        }

        return {
            validationMessages: [],
            units: results,
        }
    },
    [FACTIONS.FREELANCE.id]: (armyList: ArmyList) => {
        const results = []
        for (const u of armyList.units) {
            if (u.quantity > 1) {
                results.push({
                    id: u.id,
                    quantity: u.quantity,
                    validationMessages: [`You may not have more than 2 units of any type (veterans still count as the same unit type)`],
                })
            }
        }

        return {
            validationMessages: [],
            units: results,
        }
    },
    [FACTIONS.SURVEYFI.id]: (armyList: ArmyList) => {
        const results = []
        for (const u of armyList.units) {
            const unit = UNITS_BY_ID[u.id]
            const hp = unit.hp ?? 0

            if (hp > 4) {
                results.push({
                    id: u.id,
                    quantity: u.quantity,
                    validationMessages: [`You may not have any Units with more than 4 HP`],
                })
            }
        }

        const unitCount = armyList.units.reduce((c, v) => c + v.quantity, 0)
        let surveyorUnitCount = 0
        const maxPoints = getArmyListMaxPoints(armyList)
        let surveyorUnitTotalCost = 0

        for (const u of armyList.units) {
            const unit = UNITS_BY_ID[u.id]
            const isSurveyor = unit.traits.includes(TRAITS.SURVEYOR.display_name)
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

        return {
            validationMessages,
            units: results,
        }
    },
}

type FactionValidationResult = {
    validationMessages: string[]
    units: {
        id: UnitId,
        quantity: number,
        validationMessages: string[]
    }[]
}

type FactionValidator = (armyList: ArmyList) => FactionValidationResult

export function validateArmyListFaction(armyList: ArmyList) {
    const validator = FACTION_VALIDATORS_BY_ID[armyList.faction_id]
    return validator(armyList)
}
