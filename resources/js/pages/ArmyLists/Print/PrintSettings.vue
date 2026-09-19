<script setup lang="ts">
import { computed, useSlots } from 'vue'

const slots = useSlots()
const hasFooter = computed(() => {
    if (typeof slots?.footer === 'function') {
        return slots.footer({}).length > 0
    }
})

</script>
<template>
    <div class="print-settings-container m-auto">
        <div class="card my-3">
            <div class="card-body">
                <div class="d-flex">
                    <div class="flex-grow-1 py-1 title text-sulfur">
                        Print Settings
                    </div>
                    <div class="flex-shrink-1">
                        <div class="btn-group ms-1" role="group">
                            <slot name="nav"></slot>
                        </div>
                    </div>
                </div>
                <slot name="body"></slot>
            </div>
            <div v-if="hasFooter" class="card-footer">
                <div class="d-flex">
                    <div class="flex-grow-1"></div>
                    <div class="flex-shrink-1">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
