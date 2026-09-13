<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import Toaster from '@/components/Toaster.vue';
import type { BreadcrumbItem } from '@/types';
</script>

<template>
    <div class="min-vh-100 container">
        <AppHeader />
        <main class="container-fluid flex-grow-1 py-4">
            <slot />
        </main>
        <Toaster />
    </div>
</template>
