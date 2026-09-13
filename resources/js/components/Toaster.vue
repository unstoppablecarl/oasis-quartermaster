<script lang="ts" setup>
import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
    XIcon,
} from '@lucide/vue';
import { Toaster as Sonner } from 'vue-sonner';
</script>

<template>
    <Sonner
        :style="{
            '--normal-bg': 'var(--bs-body-bg)',
            '--normal-text': 'var(--bs-body-color)',
            '--normal-border': 'var(--bs-border-color)',
            '--border-radius': 'var(--bs-border-radius)',
        }"
    >
        <template #success-icon>
            <CircleCheckIcon :size="16" />
        </template>
        <template #info-icon>
            <InfoIcon :size="16" />
        </template>
        <template #warning-icon>
            <TriangleAlertIcon :size="16" />
        </template>
        <template #error-icon>
            <OctagonXIcon :size="16" />
        </template>
        <template #loading-icon>
            <Loader2Icon :size="16" class="animate-spin" />
        </template>
        <template #close-icon>
            <XIcon :size="16" />
        </template>
    </Sonner>
</template>
