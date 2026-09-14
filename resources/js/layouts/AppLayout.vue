<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import Toaster from '@/components/Toaster.vue'
</script>

<template>
    <div class="min-vh-100 d-flex flex-column">
        <AppHeader />
        <main class="container flex-grow-1 py-4">
            <slot />
        </main>
        <div id="page-footer" />
        <AppFooter />
        <Toaster />
    </div>
</template>
