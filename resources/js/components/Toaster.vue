<script lang="ts" setup>
import {
    PhCheckCircle,
    PhInfo,
    PhSpinner,
    PhWarning,
    PhWarningOctagon,
    PhX,
} from '@phosphor-icons/vue'
import { Toaster as Sonner } from 'vue-sonner'
</script>

<template>
    <Sonner
        :style="{
            '--normal-bg': 'var(--bs-body-bg)',
            '--normal-text': 'var(--bs-body-color)',
            '--normal-border': 'var(--bs-border-color)',
            '--border-radius': 'var(--bs-border-radius)',
        }"
        :offset="60"
    >
        <template #success-icon>
            <PhCheckCircle :size="16" />
        </template>
        <template #info-icon>
            <PhInfo :size="16" />
        </template>
        <template #warning-icon>
            <PhWarning :size="16" />
        </template>
        <template #error-icon>
            <PhWarningOctagon :size="16" />
        </template>
        <template #loading-icon>
            <PhSpinner :size="16" class="animate-spin" />
        </template>
        <template #close-icon>
            <PhX :size="16" />
        </template>
    </Sonner>
</template>
