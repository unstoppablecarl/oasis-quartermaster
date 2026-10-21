<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'
import { BPopover } from 'bootstrap-vue-next'
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import type { UnitId } from '../../../data/units'
import UnitValidationMessages from './UnitValidationMessages.vue'

const {
    unitId,
    coreMessages,
    factionMessages,
    unitMessages,
    headingClass = 'text-danger fw-bold',
    textClass,
    factionId,
} = defineProps<{
    unitId: UnitId,
    coreMessages?: string[]
    factionMessages?: string[]
    unitMessages?: string[]
    headingClass?: string
    textClass?: string
    factionId: FactionId
}>()

const hasMessages = computed(() => !!(
    coreMessages?.length ||
    factionMessages?.length ||
    unitMessages?.length
))
</script>
<template>
    <BPopover variant="light">
        <template #target>
            <button
                v-if="hasMessages"
                role="button"
                class="btn btn-danger btn-popover-validation"
            >
                <PhWarning weight="fill" />
            </button>
        </template>
        <UnitValidationMessages
            :unit-id="unitId"
            :faction-id="factionId"
            :faction-messages="factionMessages"
            :core-messages="coreMessages"
            :heading-class="headingClass"
            :text-class="textClass"
            :unit-messages="unitMessages"
        />
    </BPopover>
</template>
