<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { create, index as armyLists } from '../routes/army-lists'
</script>

<template>
    <Head title="Home" />

    <div class="text-center mx-auto py-5">
        <img src="/images/logo.png" class="img-fluid" alt="Oasis Game Logo"/>

        <p class="lead text-secondary mb-4">
            Create and Manage your army lists for Oasis: Tactical Salvage Reclamation
        </p>
        <div class="text-center">
            <Link

                :href="create()"
                class="btn btn-primary mx-1"
            >
                Create
            </Link>
            <Link
                :href="armyLists()"
                class="btn btn-primary mx-1"
            >
                Manage
            </Link>
        </div>
    </div>
</template>
