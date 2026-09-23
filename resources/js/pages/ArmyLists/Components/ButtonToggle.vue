<script setup lang="ts">
import { PhCheck, PhX } from '@phosphor-icons/vue'
import { BButton, type ButtonVariant } from 'bootstrap-vue-next'

const value = defineModel<boolean>({ required: true })
const {
    classOn = 'success',
    classOff = 'danger',
} = defineProps<{
    classOn?: ButtonVariant
    classOff?: ButtonVariant
}>()
</script>
<template>
    <BButton
        v-model:pressed="value"
        :variant="value ? classOn : classOff"
        role="button"
    >
        <PhCheck v-if="value" />
        <PhX v-else />
        &nbsp;
        <slot />
    </BButton>
</template>
