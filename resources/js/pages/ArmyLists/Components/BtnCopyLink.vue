<script setup lang="ts">
import { PhClipboard } from '@phosphor-icons/vue'
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
    <button
        role="button"
        class="btn btn-outline-info"
        @click="copy"
        v-b-tooltip="'Copy Army List URL to Clipboard'"
    >
        <PhClipboard :size="16" />
    </button>
</template>
