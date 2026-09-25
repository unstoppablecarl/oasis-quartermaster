<script setup lang="ts">

const { variant } = defineProps<{
    variant: string
}>()
</script>
<template>
    <div class="d-flex">
        <div class="title pb-2 hazard-title" :class="`text-${variant}`">
            <slot />
        </div>
        <div class="flex-grow-1 ms-2 hazard hazard-title-strip" :class="`hazard-${variant}`"></div>
        <slot name="after"/>
    </div>
</template>
<style lang="scss">

</style>
