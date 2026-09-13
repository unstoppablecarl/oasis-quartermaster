<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue';
import { useAppearance } from '@/composables/useAppearance';

const { appearance, updateAppearance } = useAppearance();

const tabs = [
    { value: 'light', Icon: Sun, label: 'Light' },
    { value: 'dark', Icon: Moon, label: 'Dark' },
    { value: 'system', Icon: Monitor, label: 'System' },
] as const;
</script>

<template>
    <div class="btn-group" role="group" aria-label="Appearance">
        <button
            v-for="{ value, Icon, label } in tabs"
            :key="value"
            type="button"
            class="btn d-flex align-items-center"
            :class="
                appearance === value ? 'btn-primary' : 'btn-outline-secondary'
            "
            @click="updateAppearance(value)"
        >
            <Icon class="me-1" :size="16" />
            {{ label }}
        </button>
    </div>
</template>
