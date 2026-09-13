<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import PlaceholderPattern from '@/components/PlaceholderPattern.vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
        ],
    },
});
</script>

<template>
    <Head title="Dashboard" />

    <div class="d-flex flex-column gap-4">
        <div class="row g-4">
            <div class="col-md-4" v-for="n in 3" :key="n">
                <div
                    class="position-relative border rounded overflow-hidden"
                    style="aspect-ratio: 16 / 9"
                >
                    <PlaceholderPattern />
                </div>
            </div>
        </div>
        <div
            class="position-relative border rounded overflow-hidden flex-grow-1"
            style="min-height: 50vh"
        >
            <PlaceholderPattern />
        </div>
    </div>
</template>
