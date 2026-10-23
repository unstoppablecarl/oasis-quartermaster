import type { UnitId } from '../../data/units'
import type { LocalArmyList, UnitEntry } from '../types/army-list'
import { CORE_VALIDATOR, type CoreArmyListValidation } from './core-validators'
import { FACTION_VALIDATOR } from './faction-validators'
import { UNIT_VALIDATOR } from './unit-validators'

export type UnitValidation = {
    core: string[]
    faction: string[]
    unit: string[]
}

export type UnitCandidateValidation = UnitValidation & {
    /**
     * False when the faction never allows this unit, regardless of the rest of the army list.
     */
    allowed: boolean
}

export type ArmyListValidation = {
    core: CoreArmyListValidation
    faction: string[]
}

export function hasValidationMessages(validation: UnitValidation): boolean {
    return !!(
        validation.core.length ||
        validation.faction.length ||
        validation.unit.length
    )
}

export function isCoreArmyListValid(core: CoreArmyListValidation): boolean {
    return (
        core.pointLimitValid &&
        core.commandCardsValid &&
        core.hasAtLeastOneSurveyorUnit &&
        core.hasAtLeastOneTransportUnit
    )
}

export function validateUnitInList(armyList: LocalArmyList, entry: UnitEntry): UnitValidation {
    return {
        core: CORE_VALIDATOR.validateUnitInList(armyList, entry),
        faction: FACTION_VALIDATOR.validateUnitInList(armyList, entry),
        unit: UNIT_VALIDATOR.validateUnitInList(armyList, entry),
    }
}

export function validateUnitCandidate(armyList: LocalArmyList, unitId: UnitId): UnitCandidateValidation {
    const candidateList = withAddedUnit(armyList, unitId)
    const entry = candidateList.units.find((unit) => unit.id === unitId)!

    return {
        allowed: !FACTION_VALIDATOR.validateUnitAllowed(armyList.faction_id, unitId).length,
        // core rules are skipped here as they only have to do with the 50% rules
        core: [],
        faction: FACTION_VALIDATOR.validateUnitInList(candidateList, entry),
        unit: UNIT_VALIDATOR.validateUnitCandidate(armyList, unitId),
    }
}

export function validateArmyList(armyList: LocalArmyList): ArmyListValidation {
    return {
        core: CORE_VALIDATOR.validateArmyList(armyList),
        faction: FACTION_VALIDATOR.validateArmyList(armyList),
    }
}

function withAddedUnit(armyList: LocalArmyList, unitId: UnitId): LocalArmyList {
    const exists = armyList.units.some((unit) => unit.id === unitId)
    const units = exists
        ? armyList.units.map((unit) => unit.id === unitId ? { ...unit, quantity: unit.quantity + 1 } : unit)
        : [...armyList.units, { id: unitId, quantity: 1 }]

    return { ...armyList, units }
}
