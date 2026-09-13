<script setup lang="ts">
defineProps<{
    message?: string;
}>();
</script>

<template>
    <div v-show="message">
        <p class="small text-danger mb-0">
            {{ message }}
        </p>
    </div>
</template>
