import { type UnitId, UNITS } from '../../data/units'
import type { LocalArmyList, UnitEntry } from '../composables/useUnitsInfo'
import { getUnitFullName } from './static-data-helpers'

const UNIT_VALIDATORS_BY_ID: Partial<Record<UnitId, UnitValidator>> = {
    [UNITS.BUFFALO_4.id]: (() => {

        function validate(armyList: LocalArmyList, isValid: (buffaloCount: number, buffaloQCount: number) => boolean) {
            const buffaloCount = armyList.units.find(unit => unit.id === UNITS.BUFFALO_3.id)?.quantity ?? 0
            const buffaloQCount = armyList.units.find(unit => unit.id === UNITS.BUFFALO_4.id)?.quantity ?? 0

            if (!isValid(buffaloCount, buffaloQCount)) {
                const buffaloName = getUnitFullName(UNITS.BUFFALO_3.id)
                const buffaloQName = getUnitFullName(UNITS.BUFFALO_4.id)

                return {
                    id: UNITS.BUFFALO_4.id,
                    validationMessages: [
                        `You may not have more ${buffaloQName} (${buffaloQCount}) Units than ${buffaloName} (${buffaloCount}) Units.`,
                    ],
                }
            }
        }

        function validateUnitInList(armyList: LocalArmyList) {
            const result = validate(armyList, (buffaloCount, buffaloQCount) => buffaloQCount <= buffaloCount)

            if (result) {
                const buffaloQCount = armyList.units.find(unit => unit.id === UNITS.BUFFALO_4.id)?.quantity ?? 0
                return {
                    ...result,
                    quantity: buffaloQCount,
                }
            }
        }

        return {
            validateUnitInList,
            validateUnitCandidate: (armyList: LocalArmyList) => validate(armyList, (buffaloCount, buffaloQCount) => buffaloQCount < buffaloCount),
        }
    })(),
}

export type UnitValidationResult = {
    id: UnitId
    quantity: number
    validationMessages: string[]
}

type UnitValidator = {
    validateUnitInList: (
        armyList: LocalArmyList,
    ) => UnitValidationResult | undefined
    validateUnitCandidate: (
        armyList: LocalArmyList,
    ) => Omit<UnitValidationResult, 'quantity'> | undefined
}

export const ARMY_LIST_UNIT_VALIDATOR = {
    validateUnitInList(armyList: LocalArmyList, unit: UnitEntry) {
        return UNIT_VALIDATORS_BY_ID[unit.id]?.validateUnitInList(armyList)
    },
    validateUnitCandidate(armyList: LocalArmyList, unitId: UnitId) {
        return UNIT_VALIDATORS_BY_ID[unitId]?.validateUnitCandidate(armyList)
    },
}
