<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import AppLogoIcon from '@/components/AppLogoIcon.vue'

const name = usePage().props.name
</script>

<template>
    <div
        class="d-flex align-items-center justify-content-center rounded bg-primary text-white"
        style="width: 2rem; height: 2rem"
    >
        <AppLogoIcon style="width: 1.25rem; height: 1.25rem" />
    </div>
    <span class="ms-2 fw-semibold">{{ name }}</span>
</template>
