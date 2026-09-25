<script setup lang="ts">
import { PhEye, PhEyeClosed } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { ref, useTemplateRef } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()

const showPassword = ref(false)
const inputRef = useTemplateRef('inputRef')

defineExpose({
    $el: inputRef,
    focus: () => inputRef.value?.focus(),
})
</script>

<template>
    <div class="input-group">
        <input
            ref="inputRef"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="props.class"
            v-bind="$attrs"
        />
        <button
            type="button"
            class="btn btn-outline-secondary"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            :tabindex="-1"
        >
            <PhEye v-if="showPassword" :size="16" />
            <PhEyeClosed v-else :size="16" />
        </button>
    </div>
</template>
