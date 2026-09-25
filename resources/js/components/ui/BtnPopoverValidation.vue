<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'
import { BPopover } from 'bootstrap-vue-next'
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import ValidationMessages from './ValidationMessages.vue'

const { messages, factionMessages, headingClass = 'text-danger fw-bold', textClass, factionId } = defineProps<{
    messages?: string[]
    factionMessages?: string[]
    headingClass?: string
    textClass?: string
    factionId: FactionId
}>()

const hasMessages = computed(() => messages?.length || factionMessages?.length)
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
        <ValidationMessages
            :faction-id="factionId"
            :faction-messages="factionMessages"
            :messages="messages"
            :heading-class="headingClass"
            :text-class="textClass"
        />

    </BPopover>
</template>
