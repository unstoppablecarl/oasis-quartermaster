<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import Fraction from '../../../components/Fraction.vue'
import { injectArmyList } from '../../../composables/useArmyList'

const {
    processing = false,
    saveDisabled = false,
    saveLabel = 'Save',
    saveStatus = 'idle',
} = defineProps<{
    processing?: boolean
    saveDisabled?: boolean
    saveLabel?: string
    autosave?: boolean
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}>()

const {
    armyList,
    faction,
    commands,
    totalCost,
    maxPoints,
    unitCount,
    maxUnits
} = injectArmyList()

const emit = defineEmits<{
    save: []
}>()

const saveBarRef = useTemplateRef<HTMLElement>('saveBar')

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
        if (saveBarRef.value) {
            document.documentElement.style.setProperty(
                '--save-bar-height',
                `${saveBarRef.value.offsetHeight}px`,
            )
        }
    })
    resizeObserver.observe(saveBarRef.value as HTMLElement)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    document.documentElement.style.removeProperty('--save-bar-height')
})

const commandNames = computed(() =>
    commands.value.map((command) => command.display_name),
)
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
        <div ref="saveBar" class="save-bar fixed-bottom border-top">
            <div class="container">
                <div class="hstack save-bar-info">
                    <div class="hstack me-auto save-bar-fields">
                        <div class="save-bar-name">
                            <strong class="text-body-emphasis">Name:&nbsp;</strong
                            >
                            <span v-if="armyList.display_name" class="text-truncate">{{
                                    armyList.display_name
                                }}</span>
                            <span v-else class="text-danger-emphasis">Unnamed</span>
                        </div>
                        <div>
                            <strong class="text-body-emphasis">Faction: </strong>
                            <span>{{ faction.display_name }}</span>
                        </div>
                        <div>
                            <strong class="text-body-emphasis">Commands: </strong>
                            <span v-if="commandNames.length">{{
                                    commandNames.join(', ')
                                }}</span>
                            <span v-else class="text-danger-emphasis">None Selected</span>
                        </div>

                        <div>
                            <strong class="text-body-emphasis">
                                Unit Count:
                            </strong>
                            <span>
                                <Fraction :a="unitCount" :b="maxUnits" less-than-or-equal-class="text-success-emphasis" />
                            </span>
                        </div>

                        <div>
                            <strong class="text-body-emphasis">
                                Total Points:
                            </strong>
                            <Fraction :a="totalCost" :b="maxPoints" less-than-or-equal-class="text-success-emphasis" />
                        </div>
                    </div>

                    <button
                        v-if="!autosave"
                        type="button"
                        class="btn btn-primary btn-sm flex-shrink-0"
                        :disabled="processing || saveDisabled"
                        @click="emit('save')"
                    >
                        {{ saveLabel }}
                    </button>
                    <div
                        v-else-if="saveStatusText"
                        class="btn-sm-py pe-3 small flex-shrink-0"
                        :class="{
                            'text-danger-emphasis': saveStatus === 'error',
                            'text-success-emphasis': saveStatus !== 'error',
                        }"
                    >
                        {{ saveStatusText }}
                    </div>
                    <div class="small text-danger save-bar-note">
                        <slot name="note" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss">
.save-bar-info {
    flex-wrap: wrap;
    column-gap: $spacer * 1.5;
    row-gap: 0.25rem;
}

.save-bar-fields {
    flex-wrap: wrap;
    column-gap: $spacer * 1.5;
    row-gap: 0.25rem;
    min-width: 0;
}

.save-bar-name {
    display: flex;
    min-width: 0;
    max-width: min(40vw, 320px);

    .text-truncate {
        min-width: 0;
    }
}

.save-bar-note {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
