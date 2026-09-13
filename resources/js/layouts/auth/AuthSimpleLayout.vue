<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { home } from '@/routes';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary py-5"
    >
        <div class="w-100" style="max-width: 24rem">
            <div class="d-flex flex-column align-items-center gap-2 mb-4">
                <Link
                    :href="home()"
                    class="d-flex flex-column align-items-center gap-2 text-decoration-none"
                >
                    <div
                        class="d-flex align-items-center justify-content-center rounded"
                        style="width: 2.25rem; height: 2.25rem"
                    >
                        <AppLogoIcon style="width: 2.25rem; height: 2.25rem" />
                    </div>
                    <span class="visually-hidden">{{ title }}</span>
                </Link>
                <div class="text-center">
                    <h1 class="h4 mb-1">{{ title }}</h1>
                    <p class="text-secondary small mb-0">{{ description }}</p>
                </div>
            </div>
            <slot />
        </div>
    </div>
</template>
