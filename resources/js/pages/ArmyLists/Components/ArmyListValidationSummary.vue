<script setup lang="ts">
import { computed } from 'vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import ValidationMessages from '../../../components/ui/ValidationMessages.vue'
import { useArmyList } from '../../../composables/useArmyList'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'
import { getArmyListFactionValidator } from '../../../lib/faction-validators'

const { armyList, headingClass, textClass = 'text-danger-emphasis' } = defineProps<{
    armyList: LocalArmyList,
    headingClass?: string
    textClass?: string
}>()

const { unitsInfo, faction } = useArmyList(armyList)

const validator = computed(() => getArmyListFactionValidator(armyList.faction_id))
const factionRequirementMessages = computed(() => validator.value.validateArmyList(armyList))

const unitsWithIssues = computed(() => {
    return unitsInfo.value.filter(u => u.validationMessages.length || u.factionValidation?.validationMessages?.length)
})

const valid = computed(() => !factionRequirementMessages.value.length && !unitsWithIssues.value.length)
</script>
<template>
    <div class="card mb-3" v-if="!valid">
        <div class="card-body">
            <HazardTitle variant="danger">
                Validation
            </HazardTitle>
            <div v-if="factionRequirementMessages.length">
                <div class="text-warning fw-bold">
                    <span class="text-teal">{{ faction.display_name }}</span>
                    Faction Requirements
                </div>
                <ul>
                    <li v-for="message in factionRequirementMessages" class="text-danger-emphasis">{{ message }}</li>
                </ul>
            </div>
            <div v-if="unitsWithIssues.length">
                <div class="title text-warning">Invalid Units</div>
                <div v-for="unit in unitsWithIssues" :key="unit.id" class="invalid-unit">
                    <div>
                        <strong>{{ unit.display_name }}</strong>
                        <template v-if="unit.quantity > 1"> &times; {{ unit.quantity }}</template>
                    </div>
                    <ValidationMessages
                        :faction-id="armyList.faction_id"
                        :messages="unit.validationMessages"
                        :faction-messages="unit.factionValidation?.validationMessages"
                        :text-class="textClass"
                        :heading-class="headingClass"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.invalid-unit:not(:last-child) {
    margin-bottom: 1rem;
}
</style>
