<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'
import { BPopover } from 'bootstrap-vue-next'
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import type { UnitId } from '../../../data/units'
import { hasValidationMessages, type UnitValidation } from '../../lib/army-list-validation'
import UnitValidationMessages from './UnitValidationMessages.vue'

const {
    unitId,
    validation,
    headingClass = 'text-danger fw-bold',
    textClass,
    factionId,
} = defineProps<{
    unitId: UnitId,
    validation: UnitValidation
    headingClass?: string
    textClass?: string
    factionId: FactionId
}>()

const hasMessages = computed(() => hasValidationMessages(validation))
</script>
<template>
    <BPopover v-if="hasMessages" variant="light">
        <template #target>
            <button
                role="button"
                class="btn btn-danger btn-popover-validation"
            >
                <PhWarning weight="fill" />
            </button>
        </template>
        <UnitValidationMessages
            :unit-id="unitId"
            :faction-id="factionId"
            :validation="validation"
            :heading-class="headingClass"
            :text-class="textClass"
        />
    </BPopover>
</template>
