<script setup lang="ts">
import { computed } from 'vue'
import type { CommandId } from '../../../../data/commands'
import type { FactionId } from '../../../../data/factions'
import Fraction from '../../../components/Fraction.vue'
import { COMMANDS_BY_ID, getFactionName } from '../../../lib/static-data-helpers'

const {
    name,
    factionId,
    maxPoints = null,
    processing = false,
    saveDisabled = false,
    saveLabel = 'Save',
    totalCost,
    unitCount,
    commandIds,
    saveStatus = 'idle',
} = defineProps<{
    name: string
    factionId: FactionId,
    commandIds: CommandId[],
    totalCost: number
    maxPoints?: number | null
    processing?: boolean
    saveDisabled?: boolean
    saveLabel?: string
    unitCount: number
    autosave?: boolean
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}>()

const emit = defineEmits<{
    save: []
}>()

const faction = computed(() => getFactionName(factionId))

const commands = computed(() => commandIds.map(id => COMMANDS_BY_ID[id].display_name))
const saveStatusText = computed(() => {
    switch (saveStatus) {
        case 'saving':
            return 'Saving…'
        case 'saved':
            return 'All changes saved'
        case 'error':
            return 'Failed to save'
        default:
            return ''
    }
})
</script>
<template>
    <Teleport to="#before-page-footer-teleport" defer>
        <div class="save-bar fixed-bottom border-top">
            <div class="container py-1">
                <div class="d-flex align-items-center flex-wrap gap-2">
                    <div class="btn-sm-py me-auto">
                        <strong class="text-body-emphasis">Army List: </strong>

                        <span v-if="name">{{ name }}</span>
                        <span v-else class="text-danger-emphasis">Unnamed</span>
                        <strong class="text-body-emphasis ms-3">Faction: </strong>
                        <span>{{ faction }}</span>

                        <strong class="text-body-emphasis ms-3">Commands: </strong>
                        <span v-if="commands.length">{{ commands.join(', ') }}</span>
                        <span v-else class="text-danger-emphasis">None Selected</span>
                    </div>
                    <div class="btn-sm-py mx-2">
                        <strong class="text-body-emphasis"> Unit Count: </strong>
                        <span>
                            {{ unitCount }}
                        </span>
                    </div>

                    <div class="btn-sm-py ms-2">
                        <strong class="text-body-emphasis"> Total Points: </strong>
                        <Fraction :a="totalCost" :b="maxPoints" />
                    </div>
                    <button
                        v-if="!autosave"
                        type="button"
                        class="btn btn-primary btn-sm"
                        :disabled="processing || saveDisabled"
                        @click="emit('save')"
                    >
                        {{ saveLabel }}
                    </button>
                    <div
                        v-else-if="saveStatusText"
                        class="btn-sm-py px-3 small"
                        :class="{
                            'text-danger': saveStatus === 'error',
                            'text-success': saveStatus !== 'error',
                        }"
                    >
                        {{ saveStatusText }}
                    </div>
                    <div class="small text-danger">
                        <slot name="note" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
