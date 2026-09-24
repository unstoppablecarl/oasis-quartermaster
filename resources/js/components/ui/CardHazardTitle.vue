<script setup lang="ts">

const { variant, title } = defineProps<{
    title: string,
    variant: string
}>()
</script>
<template>
    <div class="d-flex">
        <div
            class="title hazard-title btn-sm-py d-flex align-items-center fs-5"
            :class="`text-${variant}`"
        >
            {{ title }}
        </div>
        <div class="mx-2 py-1 flex-grow-1">
            <div
                class="hazard hazard-title-strip h-100"
                :class="`hazard-${variant}`"
            ></div>
        </div>
        <slot />
    </div>
</template>
<style lang="scss">

</style>
