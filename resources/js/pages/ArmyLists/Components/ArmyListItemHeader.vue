<script setup lang="ts">
defineProps<{
    title: string
    description?: string
}>()
</script>

<template>
    <div class="d-flex">
        <div class="me-auto">
            <h5 class="d-inline-block m-0">{{ title }}</h5>
            <span class="fs-5 ms-2 text-sand me-auto">
                {{ description }}
            </span>
        </div>
        <slot />
    </div>
    <div class="hazard-rule"></div>
</template>
