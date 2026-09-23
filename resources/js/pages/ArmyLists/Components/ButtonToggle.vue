<script setup lang="ts">
import { Check, X } from '@lucide/vue'
import { PhFunnel } from '@phosphor-icons/vue'
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
        <slot v-if="value" name="icon-on">
            <PhFunnel weight="fill"/>
        </slot>
        <slot v-else name="icon-off">
            <PhFunnel />
        </slot>
        <span class="ms-1">
            <slot />
        </span>
    </BButton>
</template>
