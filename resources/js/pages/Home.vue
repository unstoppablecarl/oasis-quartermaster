<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { dashboard } from '@/routes';
import { computed } from 'vue';

const page = usePage();
const auth = computed(() => page.props.auth);
</script>

<template>
    <Head title="Home" />

    <div class="text-center mx-auto py-5">
        <h1 class="display-5 fw-bold mb-3">Oasis Quartermaster</h1>
        <p class="lead text-secondary mb-4">
            Build and manage your army lists.
        </p>
    </div>
</template>
