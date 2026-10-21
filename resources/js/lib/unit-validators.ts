import { type UnitId, UNITS } from '../../data/units'
import type { LocalArmyList, UnitEntry } from '../types/army-list'
import { getUnitFullName } from './static-data-helpers'

type UnitValidator = {
    /**
     * Messages for this unit's entry based on the rest of the army list.
     */
    validateUnitInList: (armyList: LocalArmyList, entry: UnitEntry) => string[]
    /**
     * Messages for adding one more of this unit to the army list.
     */
    validateUnitCandidate: (armyList: LocalArmyList) => string[]
}

function getQuantity(armyList: LocalArmyList, unitId: UnitId) {
    return armyList.units.find((unit) => unit.id === unitId)?.quantity ?? 0
}

const UNIT_VALIDATORS_BY_ID: Partial<Record<UnitId, UnitValidator>> = {
    [UNITS.BUFFALO_4.id]: (() => {
        function validate(armyList: LocalArmyList, isValid: (buffaloCount: number, buffaloQCount: number) => boolean) {
            const buffaloCount = getQuantity(armyList, UNITS.BUFFALO_3.id)
            const buffaloQCount = getQuantity(armyList, UNITS.BUFFALO_4.id)

            if (isValid(buffaloCount, buffaloQCount)) {
                return []
            }

            const buffaloName = getUnitFullName(UNITS.BUFFALO_3.id)
            const buffaloQName = getUnitFullName(UNITS.BUFFALO_4.id)

            return [
                `You may not have more ${buffaloQName} (${buffaloQCount}) Units than ${buffaloName} (${buffaloCount}) Units.`,
            ]
        }

        return {
            validateUnitInList: (armyList: LocalArmyList) =>
                validate(armyList, (buffaloCount, buffaloQCount) => buffaloQCount <= buffaloCount),
            validateUnitCandidate: (armyList: LocalArmyList) =>
                validate(armyList, (buffaloCount, buffaloQCount) => buffaloQCount < buffaloCount),
        }
    })(),
}

export const UNIT_VALIDATOR = {
    validateUnitInList(armyList: LocalArmyList, entry: UnitEntry): string[] {
        return UNIT_VALIDATORS_BY_ID[entry.id]?.validateUnitInList(armyList, entry) ?? []
    },
    validateUnitCandidate(armyList: LocalArmyList, unitId: UnitId): string[] {
        return UNIT_VALIDATORS_BY_ID[unitId]?.validateUnitCandidate(armyList) ?? []
    },
}
