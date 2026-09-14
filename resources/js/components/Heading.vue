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
            :class="variant === 'small' ? 'mb-2' : 'mb-2'"
        >
            {{ title }}
        </component>
        <p v-if="description" class="text-secondary small mb-0">
            {{ description }}
        </p>
        <div class="hazard-rule"></div>

    </header>
</template>
