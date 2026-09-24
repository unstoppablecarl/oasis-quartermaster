<script setup lang="ts">
import { PhWarning } from '@phosphor-icons/vue'
import { BPopover } from 'bootstrap-vue-next'
import { computed } from 'vue'

const { messages, factionMessages } = defineProps<{
    messages?: string[]
    factionMessages?: string[],
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
        <template v-if="messages?.length">
            <div class="text-danger fw-bold">Rules Violation</div>
            <ul v-if="messages.length > 1">
                <li v-for="item in messages">
                    {{ item }}
                </li>
            </ul>
            <div v-else>{{ messages[0] }}</div>
        </template>
        <template v-if="factionMessages?.length">
            <div class="text-danger fw-bold">Faction Violation</div>
            <ul v-if="factionMessages.length > 1">
                <li v-for="item in factionMessages">
                    {{ item }}
                </li>
            </ul>
            <div v-else>{{ factionMessages[0] }}</div>
        </template>
    </BPopover>
</template>
