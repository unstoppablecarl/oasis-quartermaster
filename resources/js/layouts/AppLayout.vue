<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import Toaster from '@/components/Toaster.vue'

const {
    showFooter = true,
    printLayout = false,
    saveBarPadding = false,
    containerFluid = false,
} = defineProps<{
    showFooter?: boolean
    printLayout?: boolean
    saveBarPadding?: boolean
    containerFluid?: boolean
}>()
</script>
<template>
    <div
        class="d-flex flex-column"
        :class="{ 'no-print': printLayout, 'min-vh-100': !printLayout }"
    >
        <AppHeader />
        <div class="bg-main flex-grow-1">
            <main
                class="flex-grow-1 pt-4"
                :class="{
                    'container-fluid': containerFluid,
                    container: !containerFluid,
                }"
            >
                <slot />
            </main>
            <div id="before-page-footer-teleport" />
        </div>
        <AppFooter v-if="showFooter" :save-bar-padding="saveBarPadding" />
        <Toaster richColors theme="dark" />
    </div>
    <div id="after-app-teleport"></div>
</template>
