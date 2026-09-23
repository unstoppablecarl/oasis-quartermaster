<script setup lang="ts">
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpWideNarrow } from '@lucide/vue'
import { SORT_ASC, SORT_DESC, SORT_NONE, type SortMode } from '../../lib/static-data-helpers'

const {
    key,
    mode,
} = defineProps<{
    key: string,
    mode: SortMode
}>()

const emit = defineEmits<{
    sort: [key: string, mode: SortMode]
}>()

function cycleSort() {
    if (mode === SORT_NONE) {
        emit('sort', key, SORT_DESC)
    } else if (mode === SORT_DESC) {
        emit('sort', key, SORT_ASC)
    } else if (mode === SORT_ASC) {
        emit('sort', key, SORT_NONE)
    }
}
</script>
<template>
    <div class="btn btn-link btn-sm" @click="cycleSort">
        <ArrowDownWideNarrow v-if="mode === SORT_DESC" />
        <ArrowUpWideNarrow v-if="mode === SORT_ASC" />
        <ArrowDownUp v-if="mode === SORT_NONE" />
    </div>
    <slot />
</template>
<style lang="scss">
</style>
