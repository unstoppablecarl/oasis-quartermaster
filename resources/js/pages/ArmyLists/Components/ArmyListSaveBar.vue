<script setup lang="ts">
import Fraction from '../../../components/Fraction.vue'

withDefaults(
    defineProps<{
        totalCost: number
        maxPoints?: number | null
        processing?: boolean
        saveDisabled?: boolean
        saveLabel?: string
    }>(),
    {
        maxPoints: null,
        processing: false,
        saveDisabled: false,
        saveLabel: 'Save',
    },
)

const emit = defineEmits<{
    save: []
}>()
</script>
<template>
    <Teleport to="#page-footer" defer>
        <div class="save-bar fixed-bottom bg-black border-top">
            <div class="container py-1">
                <div class="d-flex align-items-center flex-wrap gap-2">
                    <div class="me-auto"></div>
                    <div class="btn-py px-3">
                        Total Points: <Fraction :a="totalCost" :b="maxPoints" />
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary"
                        :disabled="processing || saveDisabled"
                        @click="emit('save')"
                    >
                        {{ saveLabel }}
                    </button>
                    <div class="small text-danger">
                        <slot name="note" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
