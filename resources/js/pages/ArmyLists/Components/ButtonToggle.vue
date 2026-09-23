<script setup lang="ts">
import { PhCheck, PhX } from '@phosphor-icons/vue'
import { BButton } from 'bootstrap-vue-next'

const value = defineModel<boolean>({ required: true })
</script>
<template>
    <BButton
        v-model:pressed="value"
        :variant="value ? 'success' : 'danger'"
    >
        <PhCheck v-if="value" />
        <PhX v-else />
        &nbsp;
        <slot/>
    </BButton>
</template>
