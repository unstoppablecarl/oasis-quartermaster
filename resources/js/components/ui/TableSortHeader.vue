<script setup lang="ts">
import { ChevronDown, ChevronsUpDown, ChevronUp } from '@lucide/vue'
import type { TableField } from 'bootstrap-vue-next'

defineOptions({
    inheritAttrs: false,
})

const { mode, scope } = defineProps<{
    mode: 'asc' | 'desc' | undefined
    scope: {
        label?: string
        column: string
        field: TableField
    }
}>()

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
<template>
    {{ scope.label ?? capitalizeFirstLetter(scope.column) }}&nbsp;
    <template v-if="scope.field.sortable">
        <ChevronUp v-if="mode === 'asc'" v-bind="$attrs" />
        <ChevronDown v-else-if="mode === 'desc'" v-bind="$attrs" />
        <ChevronsUpDown v-else v-bind="$attrs" />
    </template>
</template>
