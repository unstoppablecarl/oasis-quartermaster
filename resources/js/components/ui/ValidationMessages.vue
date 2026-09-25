<script setup lang="ts">
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import { getFactionName } from '../../lib/static-data-helpers'

const {
    messages,
    factionMessages,
    headingClass = 'text-warning fw-bold',
    textClass,
    factionId,
} = defineProps<{
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
            <template v-if="messages.length > 1"> Core Rules </template>
            <template v-else> Core Rules </template>
        </div>
        <div :class="textClass">
            <ul class="mb-0">
                <li v-for="item in messages">
                    {{ item }}
                </li>
            </ul>
        </div>
    </template>
    <template v-if="factionMessages?.length">
        <div :class="headingClass">
            <div class="text-warning fw-bold">
                Faction Requirements:
                <span class="text-teal">{{ factionName }}</span>
            </div>
        </div>
        <div :class="textClass">
            <ul class="mb-0">
                <li v-for="item in factionMessages">
                    {{ item }}
                </li>
            </ul>
        </div>
    </template>
</template>
