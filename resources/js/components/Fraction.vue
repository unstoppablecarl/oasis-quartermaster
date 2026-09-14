<script setup lang="ts">
import { computed } from 'vue'

const { a, b } = defineProps<{
    a: number
    b: number | null
}>()

const containerClass = computed(() => {
    if (b === null) {
        return {}
    }

    return {
        'text-success-emphasis': a <= b,
        'text-danger': a > b,
    }
})
</script>
<template>
    <span :class="containerClass">
        {{ a }}<template v-if="b !== null">/{{ b }}</template>
    </span>
</template>
