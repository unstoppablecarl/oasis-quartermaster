<script setup lang="ts">
import { diceRoller, home, rules } from '@/routes'
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const auth = computed(() => page.props.auth)
const year = new Date().getFullYear()
</script>

<template>
    <footer class="border-top mt-auto">
        <div class="container d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
            <span class="text-secondary small">&copy; {{ year }} Oasis Quartermaster</span>
            <nav class="nav">
                <Link :href="home()" class="nav-link text-secondary small">Home</Link>
                <template v-if="auth.user">
                    <Link :href="rules()" class="nav-link text-secondary small">Rules</Link>
                    <Link :href="diceRoller()" class="nav-link text-secondary small">Dice Roller</Link>
                </template>
            </nav>
        </div>
    </footer>
</template>
