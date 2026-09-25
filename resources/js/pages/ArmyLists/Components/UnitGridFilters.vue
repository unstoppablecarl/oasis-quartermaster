<script setup lang="ts">
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'
import ButtonToggle from './ButtonToggle.vue'

const showClass = defineModel<boolean>('showClass', { required: true })
const showPrefix = defineModel<boolean>('showPrefix', { required: true })
const showManufacturer = defineModel<boolean>('showManufacturer', {
    required: true,
})
</script>

<template>
    <div class="d-flex gap-2">
        <div class="btn-sm-py fw-bold">Columns:</div>
        <div class="btn-group">
            <ButtonToggle
                v-model="showPrefix"
                class-on="success"
                class-off="info"
                size="sm"
            >
                <template #icon-on>
                    <PhEye weight="fill" />
                </template>
                <template #icon-off>
                    <PhEyeSlash weight="fill" />
                </template>
                Prefix
            </ButtonToggle>
            <ButtonToggle
                v-model="showClass"
                class-on="success"
                class-off="info"
                size="sm"
            >
                <template #icon-on>
                    <PhEye weight="fill" />
                </template>
                <template #icon-off>
                    <PhEyeSlash weight="fill" />
                </template>
                Class
            </ButtonToggle>
            <ButtonToggle
                v-model="showManufacturer"
                class-on="success"
                class-off="info"
                size="sm"
            >
                <template #icon-on>
                    <PhEye weight="fill" />
                </template>
                <template #icon-off>
                    <PhEyeSlash weight="fill" />
                </template>
                Manufacturer
            </ButtonToggle>
        </div>
        <slot />
    </div>
</template>
