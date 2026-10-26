<script setup lang="ts">
import { computed } from 'vue'

const { a, b, lessThanOrEqualClass = 'text-warning-emphasis' } = defineProps<{
    a: number
    b: number | null
    lessThanOrEqualClass?: string
}>()

const containerClass = computed(() => {
    if (b === null) {
        return {}
    }

    return {
        'text-success-emphasis': a == b,
        [lessThanOrEqualClass]: a <= b,
        'text-danger-emphasis': a > b,
    }
})
</script>
<template>
    <span :class="containerClass">
        {{ a }}
        <template v-if="b !== null"> / {{ b }}</template>
    </span>
</template>
