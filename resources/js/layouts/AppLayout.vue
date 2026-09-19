<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import Toaster from '@/components/Toaster.vue'

const {
    showFooter = true,
    printMode = false,
    saveBarPadding = false,
} = defineProps<{
    showFooter?: boolean
    printMode?: boolean
    saveBarPadding?: boolean
}>()
</script>
<template>
    <div class="d-flex flex-column" :class="{'no-print': printMode, 'min-vh-100': !printMode}">
        <AppHeader />
        <div class="bg-main">
            <main class="container flex-grow-1 py-4">
                <slot />
            </main>
            <div id="before-page-footer-teleport" />
        </div>
        <AppFooter v-if="showFooter" :save-bar-padding="saveBarPadding" />
        <Toaster />
    </div>
    <div id="after-app-teleport"></div>
</template>
