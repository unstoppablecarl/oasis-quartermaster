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
        <slot v-if="value" name="icon-on"><PhCheck /></slot>
        <slot v-else name="icon-off"><PhX /></slot>
        <span class="ms-1">
            <slot />
        </span>
    </BButton>
</template>
