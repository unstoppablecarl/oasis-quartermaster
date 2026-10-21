<script setup lang="ts">
const { variant } = defineProps<{
    variant: string
}>()
</script>
<template>
    <div class="hazard-container">
        <div class="title pb-2 hazard-title" :class="`text-${variant}`">
            <slot />
        </div>
        <div
            class="flex-grow-1 ms-2 hazard hazard-title-strip"
            :class="`hazard-${variant}`"
        ></div>
        <slot name="after" />
    </div>
</template>
<style lang="scss">
.hazard-container {
    display: flex;
}
.page-preview {
    .hazard-container {
        display: none;
    }
}
</style>
