<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import Toaster from '@/components/Toaster.vue'
</script>

<template>
    <div class="min-vh-100">
        <AppHeader />
        <main class="container flex-grow-1 py-4">
            <slot />
        </main>
        <Toaster />
    </div>
</template>
