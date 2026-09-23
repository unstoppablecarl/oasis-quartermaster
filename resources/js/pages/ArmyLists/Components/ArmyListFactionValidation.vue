<script setup lang="ts">
import { computed } from 'vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'
import { getArmyListFactionValidator, type UnitInListValidationResult } from '../../../lib/faction-validators'
import { UNITS_BY_ID } from '../../../lib/static-data-helpers'

const { armyList } = defineProps<{
    armyList: LocalArmyList
}>()

const validator = computed(() => getArmyListFactionValidator(armyList?.faction_id))
const factionValidationMessages = computed(() => validator.value.validateArmyList(armyList))
const factionUnitValidationMessages = computed(() => {
    return armyList.units.map(u => validator.value.validateUnitInList(armyList, u)).filter(v => v) as UnitInListValidationResult[]
})

const valid = computed(() => !factionValidationMessages.value.length && !factionUnitValidationMessages.value.length)

</script>
<template>
    <div class="card mb-3" v-if="!valid">
        <div class="card-body">
            <HazardTitle variant="danger">
                Faction
            </HazardTitle>
            <div v-if="factionValidationMessages.length">
                <div class="title text-warning">Requirements</div>
                <ul>
                    <li v-for="message in factionValidationMessages" class="text-danger-emphasis">{{ message }}</li>
                </ul>
            </div>
            <div v-if="factionUnitValidationMessages.length">
                <div class="title text-warning">Invalid Units</div>
                <div v-for="unit in factionUnitValidationMessages">
                    <div>
                        <strong>{{ UNITS_BY_ID[unit.id].display_name }}</strong>
                        <template v-if="unit.quantity > 1"> &times; {{ unit.quantity }}</template>
                    </div>
                    <ul>
                        <li class="text-danger-emphasis" v-for="message in unit.validationMessages">{{ message }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

</template>
<style lang="scss">

</style>
