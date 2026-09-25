<script setup lang="ts">
import { PhWarningCircle } from '@phosphor-icons/vue'
import { computed } from 'vue'

type Props = {
    errors: string[]
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Something went wrong.',
})

const uniqueErrors = computed(() => Array.from(new Set(props.errors)))
</script>

<template>
    <div class="alert alert-danger d-flex gap-2" role="alert">
        <PhWarningCircle class="flex-shrink-0 mt-1" :size="16" />
        <div>
            <h6 class="alert-heading mb-1">{{ title }}</h6>
            <ul class="mb-0 ps-3 small">
                <li v-for="(error, index) in uniqueErrors" :key="index">
                    {{ error }}
                </li>
            </ul>
        </div>
    </div>
</template>
