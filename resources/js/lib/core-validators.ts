import type { LocalArmyList, UnitEntry } from '../types/army-list'
import {
    getArmyListMaxPoints,
    getArmyListMaxUnits,
    getArmyListTotalPoints,
    getArmyListUnitCount,
    unitHasTrait,
    UNITS_BY_ID,
} from './static-data-helpers'
import { half } from './utils'

export const REQUIRED_COMMAND_CARD_COUNT = 2

export type CoreArmyListValidation = {
    pointLimitValid: boolean
    unitLimitValid: boolean
    commandCardsValid: boolean
    hasAtLeastOneSurveyorUnit: boolean
    hasAtLeastOneTransportUnit: boolean
}

export const CORE_VALIDATOR = {
    validateUnitInList(armyList: LocalArmyList, entry: UnitEntry): string[] {
        const messages: string[] = []

        const maxPoints = getArmyListMaxPoints(armyList)
        const cost = entry.quantity * UNITS_BY_ID[entry.id].cost
        if (maxPoints !== null && cost > half(maxPoints)) {
            messages.push(
                `Unit cost cannot be greater than 50% of Total Points. (${cost} / ${half(maxPoints)})`,
            )
        }

        const halfCount = half(getArmyListUnitCount(armyList))
        if (entry.quantity > halfCount) {
            messages.push(
                `Unit count cannot be greater than 50% of Total Unit Count. (${entry.quantity} / ${halfCount})`,
            )
        }

        return messages
    },
    validateArmyList(armyList: LocalArmyList): CoreArmyListValidation {
        const maxPoints = getArmyListMaxPoints(armyList)
        const maxUnits = getArmyListMaxUnits(armyList)

        return {
            hasAtLeastOneSurveyorUnit: armyList.units.some(u => unitHasTrait(u.id, 'SURVEYOR')),
            hasAtLeastOneTransportUnit: armyList.units.some(u => unitHasTrait(u.id, 'TRANSPORT')),
            pointLimitValid: maxPoints === null || getArmyListTotalPoints(armyList) <= maxPoints,
            unitLimitValid: maxUnits === null || getArmyListUnitCount(armyList) <= maxUnits,
            commandCardsValid: armyList.commands.length === REQUIRED_COMMAND_CARD_COUNT,
        }
    },
}
