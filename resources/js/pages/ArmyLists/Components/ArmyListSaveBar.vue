<script setup lang="ts">
import { computed } from 'vue'
import type { FactionId } from '../../../../data/factions'
import Fraction from '../../../components/Fraction.vue'
import { getFactionName } from '../../../lib/static-data-helpers'

const {
    name,
    factionId,
    maxPoints = null,
    processing = false,
    saveDisabled = false,
    saveLabel = 'Save',
    totalCost,
    unitCount,
} = defineProps<{
    name: string
    factionId: FactionId,
    totalCost: number
    maxPoints?: number | null
    processing?: boolean
    saveDisabled?: boolean
    saveLabel?: string
    unitCount: number
}>()

const emit = defineEmits<{
    save: []
}>()

const faction = computed(() => getFactionName(factionId))
</script>
<template>
    <Teleport to="#before-page-footer-teleport" defer>
        <div class="save-bar fixed-bottom bg-black border-top">
            <div class="container py-1">
                <div class="d-flex align-items-center flex-wrap gap-2">
                    <div class="btn-py px-3 me-auto">
                        <strong>Army List: </strong>
                        <span class="text-body-emphasis">{{ name }}</span>
                        <strong class="ms-3">Faction: </strong>
                        <span class="text-body-emphasis">{{ faction }}</span>
                    </div>
                    <div class="btn-py px-3">
                        <strong> Unit Count: </strong>
                        <span class="text-body-emphasis">
                            {{ unitCount }}
                        </span>
                    </div>
                    <div class="btn-py px-3">
                        <strong> Total Points: </strong>
                        <Fraction :a="totalCost" :b="maxPoints" />
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary"
                        :disabled="processing || saveDisabled"
                        @click="emit('save')"
                    >
                        {{ saveLabel }}
                    </button>
                    <div class="small text-danger">
                        <slot name="note" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
