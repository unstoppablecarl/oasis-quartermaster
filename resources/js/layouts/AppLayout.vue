<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import Toaster from '@/components/Toaster.vue';
import type { BreadcrumbItem } from '@/types';

const { breadcrumbs = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();
</script>

<template>
    <div class="min-vh-100 container">
        <AppHeader :breadcrumbs="breadcrumbs" />
        <main class="container-fluid flex-grow-1 py-4">
            <slot />
        </main>
        <Toaster />
    </div>
</template>
