<script setup lang="ts">
import { computed } from 'vue'
import Fraction from '../../../components/Fraction.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import UnitValidationMessages from '../../../components/ui/UnitValidationMessages.vue'
import { injectArmyList } from '../../../composables/useArmyList'
import { isCoreArmyListValid } from '../../../lib/army-list-validation'
import { REQUIRED_COMMAND_CARD_COUNT } from '../../../lib/core-validators'

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
    validation,
    unitsWithIssues,
    commands,
} = injectArmyList()

const coreValid = computed(() => isCoreArmyListValid(validation.value.core))
</script>
<template>
    <div class="card mb-3" v-if="!valid">
        <div class="card-body">
            <HazardTitle variant="danger"> Validation</HazardTitle>
            <div v-if="!coreValid" class="mb-3">
                <div class="text-warning title">Invalid Army List</div>
                <div v-if="!validation.core.pointLimitValid">
                    <span class="text-danger-emphasis">Over Point Limit: </span>
                    <Fraction :a="totalCost" :b="maxPoints" />
                </div>
                <div v-if="!validation.core.commandCardsValid">
                    <span class="text-danger-emphasis">{{ REQUIRED_COMMAND_CARD_COUNT }} Command Cards must be
                        selected: </span>
                    <Fraction :a="commands.length" :b="REQUIRED_COMMAND_CARD_COUNT" />
                </div>
                <div v-if="!validation.core.hasAtLeastOneSurveyorUnit">
                    <span class="text-danger-emphasis">At least 1 Unit with the <strong
                        class="validate-text-trait">Surveyor</strong> Trait is Required</span>
                </div>
                <div v-if="!validation.core.hasAtLeastOneTransportUnit">
                    <span class="text-danger-emphasis">At least 1 Unit with the <strong
                        class="validate-text-trait">Transport</strong> Trait is Required</span>
                </div>
            </div>

            <div v-if="validation.faction.length">
                <div class="text-warning fw-bold">
                    <span class="text-teal">{{ faction.display_name }}</span>
                    Faction Requirements
                </div>
                <ul>
                    <li
                        v-for="message in validation.faction"
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
                    <UnitValidationMessages
                        :unit-id="unit.id"
                        :faction-id="armyList.faction_id"
                        :validation="unit.validation"
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

.validate-text-trait {
    color: #fff;
}

.page-preview {
    .validate-text-trait {
        color: #000;
    }
}
</style>
