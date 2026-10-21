<script setup lang="ts">
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import type { UnitId } from '../../../data/units'
import { getFactionName, getUnitFullName } from '../../lib/static-data-helpers'

const {
    unitId,
    coreMessages,
    factionMessages,
    unitMessages,
    headingClass = 'text-warning fw-bold',
    textClass,
    factionId,
} = defineProps<{
    unitId: UnitId
    coreMessages?: string[]
    factionMessages?: string[]
    unitMessages?: string[]
    headingClass?: string
    textClass?: string
    factionId: FactionId
}>()

const factionName = computed(() => getFactionName(factionId))
</script>
<template>
    <template v-if="coreMessages?.length">
        <div :class="headingClass">Core Rules</div>
        <div :class="textClass">
            <ul class="mb-0">
                <li v-for="item in coreMessages" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
    </template>
    <template v-if="factionMessages?.length">
        <div :class="headingClass">
            Faction Requirements:
            <span class="text-teal">{{ factionName }}</span>
        </div>
        <div :class="textClass">
            <ul class="mb-0">
                <li v-for="item in factionMessages" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
    </template>
    <template v-if="unitMessages?.length">
        <div :class="headingClass">
            Unit Requirements:
            <span class="text-teal">{{ getUnitFullName(unitId) }}</span>
        </div>
        <div :class="textClass">
            <ul class="mb-0">
                <li v-for="item in unitMessages" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
    </template>
</template>
