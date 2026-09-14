<script setup lang="ts">
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
        <div class="fixed-bottom bg-dark border-top">
            <div class="container py-1">
                <div class="d-flex align-items-center flex-wrap gap-2">
                    <div class="me-auto small text-secondary">
                        <slot name="note" />
                    </div>
                    <div class="btn-py px-3">
                        Total Points: {{ totalCost
                        }}<template
                            v-if="maxPoints !== null && maxPoints !== undefined"
                        >
                            / {{ maxPoints }}</template
                        >
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary"
                        :disabled="processing || saveDisabled"
                        @click="emit('save')"
                    >
                        {{ saveLabel }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
