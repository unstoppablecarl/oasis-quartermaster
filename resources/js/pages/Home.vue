<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { dashboard, login, register } from '@/routes';
</script>

<template>
    <Head title="Home" />

    <div class="min-vh-100 d-flex flex-column">
        <header class="border-bottom">
            <div
                class="container d-flex justify-content-end align-items-center gap-3 py-3"
            >
                <template v-if="$page.props.auth.user">
                    <Link :href="dashboard()" class="btn btn-primary">
                        Dashboard
                    </Link>
                </template>
                <template v-else>
                    <Link :href="login()" class="btn btn-outline-secondary">
                        Log in
                    </Link>
                    <Link :href="register()" class="btn btn-primary">
                        Register
                    </Link>
                </template>
            </div>
        </header>

        <main
            class="flex-grow-1 d-flex align-items-center justify-content-center text-center"
        >
            <div class="container py-5" style="max-width: 40rem">
                <h1 class="display-5 fw-bold mb-3">Oasis List Builder</h1>
                <p class="lead text-secondary">
                    Build and manage your army lists.
                </p>
            </div>
        </main>
    </div>
</template>
