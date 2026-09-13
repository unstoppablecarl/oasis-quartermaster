<script setup lang="ts">
type Props = {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
};

withDefaults(defineProps<Props>(), {
    variant: 'default',
});
</script>

<template>
    <header :class="variant === 'small' ? '' : 'mb-4'">
        <component
            :is="variant === 'small' ? 'h5' : 'h3'"
            :class="variant === 'small' ? 'mb-1' : 'mb-1'"
        >
            {{ title }}
        </component>
        <p v-if="description" class="text-secondary small mb-0">
            {{ description }}
        </p>
    </header>
</template>
