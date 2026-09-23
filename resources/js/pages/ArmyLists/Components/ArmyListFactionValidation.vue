<script setup lang="ts">
import { computed } from 'vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import { validateArmyListFaction } from '../../../lib/faction-validators'
import { UNITS_BY_ID } from '../../../lib/static-data-helpers'
import type { ArmyList } from '../../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

const factionValidation = computed(() => validateArmyListFaction(armyList))
const valid = computed(() => !factionValidation.value.validationMessages.length && !factionValidation.value.units.length)

</script>
<template>
    <div class="card mb-3" v-if="!valid">
        <div class="card-body">
            <HazardTitle variant="danger">
                Faction Error
            </HazardTitle>
            <div v-if="factionValidation.validationMessages.length">
                <div class="title text-warning">Invalid Requirements</div>
                <ul>
                    <li v-for="message in factionValidation.validationMessages">{{ message }}</li>
                </ul>
            </div>
            <div v-if="factionValidation.units.length">
                <div class="title text-warning">Invalid Units</div>
                <div v-for="unit in factionValidation.units">
                    <div>
                        <strong>{{ UNITS_BY_ID[unit.id].display_name }}</strong>
                        <template v-if="unit.quantity > 1"> &times; {{ unit.quantity }}</template>
                    </div>
                    <p class="text-danger-emphasis" v-for="message in unit.validationMessages">{{ message }}</p>
                </div>
            </div>
        </div>
    </div>

</template>
<style lang="scss">

</style>
