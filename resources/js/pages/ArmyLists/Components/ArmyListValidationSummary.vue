<script setup lang="ts">
import { computed } from 'vue'
import Fraction from '../../../components/Fraction.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import ValidationMessages from '../../../components/ui/ValidationMessages.vue'
import { injectArmyList } from '../../../composables/useArmyList'

const { headingClass = 'text-teal', textClass = 'text-danger-emphasis' } =
    defineProps<{
        headingClass?: string
        textClass?: string
    }>()

const {
    armyList,
    faction,
    maxPoints,
    totalCost,
    valid,
    overPointLimit,
    factionRequirementMessages,
    unitsWithIssues,
    commandCards,
} = injectArmyList()

const pointsValid = computed(() => !overPointLimit.value)
const commandCardsValid = computed(() => commandCards.value.length === 2)
const armyListValid = computed(() => pointsValid.value && commandCardsValid.value && valid.value)

</script>
<template>
    <div class="card mb-3" v-if="!armyListValid">
        <div class="card-body">
            <HazardTitle variant="danger"> Validation</HazardTitle>
            <div v-if="overPointLimit || !commandCardsValid" class="mb-3">
                <div class="text-warning title">Invalid Army List</div>
                <div v-if="overPointLimit">
                    <span class="text-danger-emphasis">Over Point Limit: </span>
                    <Fraction :a="totalCost" :b="maxPoints" />
                </div>
                <div v-if="!commandCardsValid">
                    <span class="text-danger-emphasis">2 Command Cards must be selected: </span>
                    <Fraction :a="commandCards.length" :b="2" />
                </div>
            </div>

            <div v-if="factionRequirementMessages.length">
                <div class="text-warning fw-bold">
                    <span class="text-teal">{{ faction.display_name }}</span>
                    Faction Requirements
                </div>
                <ul>
                    <li
                        v-for="message in factionRequirementMessages"
                        class="text-danger-emphasis"
                    >
                        {{ message }}
                    </li>
                </ul>
            </div>
            <div v-if="unitsWithIssues.length">
                <div class="title text-warning">Invalid Units</div>
                <div
                    v-for="unit in unitsWithIssues"
                    :key="unit.id"
                    class="invalid-unit"
                >
                    <div>
                        <strong>{{ unit.display_name }}</strong>
                        <template v-if="unit.quantity > 1">
                            &times; {{ unit.quantity }}
                        </template>
                    </div>
                    <ValidationMessages
                        :faction-id="armyList.faction_id"
                        :messages="unit.validationMessages"
                        :faction-messages="
                            unit.factionValidation?.validationMessages
                        "
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
