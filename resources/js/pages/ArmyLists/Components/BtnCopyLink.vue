<script setup lang="ts">
import { PhCopy } from '@phosphor-icons/vue'
import { vBTooltip } from 'bootstrap-vue-next'
import { toast } from 'vue-sonner'
import { show } from '../../../routes/army-lists'

const { armyListUuid } = defineProps<{
    armyListUuid: string
}>()

async function copy() {
    try {
        let url = window.location.origin + show(armyListUuid).url
        await navigator.clipboard.writeText(url)

        toast.success('Army List Coppied')

    } catch (err) {
        console.error('Failed to copy text: ', err)
        toast.error('Failed to copy')
    }
}

</script>
<template>
    <button role="button"
            class="btn btn-outline-info btn-sm"
            @click="copy"
            v-b-tooltip.hover.top
            title="Copy Armylist URL"
    >
        <PhCopy :size="16" />
    </button>
</template>
