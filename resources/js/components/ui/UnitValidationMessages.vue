<script setup lang="ts">
import { computed } from 'vue'
import type { FactionId } from '../../../data/factions'
import type { UnitId } from '../../../data/units'
import type { UnitValidation } from '../../lib/army-list-validation'
import { getFactionName, getUnitFullName } from '../../lib/static-data-helpers'

const {
    unitId,
    validation,
    headingClass = 'text-warning fw-bold',
    textClass,
    factionId,
} = defineProps<{
    unitId: UnitId
    validation: UnitValidation
    headingClass?: string
    textClass?: string
    factionId: FactionId
}>()

const sections = computed(() =>
    [
        { key: 'core', heading: 'Core Rules', name: null, messages: validation.core },
        { key: 'faction', heading: 'Faction Requirements:', name: getFactionName(factionId), messages: validation.faction },
        { key: 'unit', heading: 'Unit Requirements:', name: getUnitFullName(unitId), messages: validation.unit },
    ].filter((section) => section.messages.length),
)
</script>
<template>
    <template v-for="section in sections" :key="section.key">
        <div :class="headingClass">
            {{ section.heading }}
            <span v-if="section.name" class="text-teal">{{ section.name }}</span>
        </div>
        <div :class="textClass">
            <ul class="mb-0">
                <li v-for="item in section.messages" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
    </template>
</template>
