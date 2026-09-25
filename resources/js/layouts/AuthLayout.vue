<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

const { title = '', description = '' } = defineProps<{
    title?: string
    description?: string
}>()
</script>

<template>
    <div class="min-vh-100 d-flex flex-column">
        <AppHeader />
        <div
            class="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5"
        >
            <div class="w-100" style="max-width: 24rem">
                <div class="d-flex flex-column align-items-center gap-2 mb-4">
                    <div class="text-center">
                        <h1 class="h4 mb-1">{{ title }}</h1>
                        <p class="text-secondary small mb-0">
                            {{ description }}
                        </p>
                    </div>
                </div>
                <slot />
            </div>
        </div>

        <AppFooter />
    </div>
</template>
