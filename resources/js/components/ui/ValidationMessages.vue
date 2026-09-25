<script setup lang="ts">
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import { getFactionName } from '../../lib/static-data-helpers'
import FactionCardViewModal from '../army-lists/FactionCardViewModal.vue'

const { messages, factionMessages, headingClass = 'text-danger fw-bold', textClass, factionId } = defineProps<{
    messages?: string[]
    factionMessages?: string[]
    headingClass?: string
    textClass?: string
    factionId: FactionId
}>()

const factionName = computed(() => getFactionName(factionId))

</script>
<template>
    <template v-if="messages?.length">
        <div :class="headingClass">
            <template v-if="messages.length > 1">
                Core Rules
            </template>
            <template v-else>
                Core Rules
            </template>
        </div>
        <div :class="textClass">
            <ul v-if="messages.length > 1">
                <li v-for="item in messages">
                    {{ item }}
                </li>
            </ul>
            <template v-else>{{ messages[0] }}</template>
        </div>
    </template>
    <template v-if="factionMessages?.length">
        <div :class="headingClass">
            <div class="text-warning fw-bold">
                <span class="text-teal">{{ factionName }}</span>
                Faction Requirements
            </div>
        </div>
        <div :class="textClass">
            <ul v-if="factionMessages.length > 1">
                <li v-for="item in factionMessages">
                    {{ item }}
                </li>
            </ul>
            <template v-else>{{ factionMessages[0] }}</template>
        </div>
    </template>
</template>
