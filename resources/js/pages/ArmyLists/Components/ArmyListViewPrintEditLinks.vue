<script setup lang="ts">
import type { InertiaLinkProps } from '@inertiajs/vue3'
import { Link } from '@inertiajs/vue3'
import { PhMonitor, PhPencilSimple, PhPrinter } from '@phosphor-icons/vue'
import { BTooltip } from 'bootstrap-vue-next'
import { useCurrentUrl } from '../../../composables/useCurrentUrl'

const {
    showHref,
    printHref,
    editHref,
    editDisabled = false,
    idPrefix,
} = defineProps<{
    showHref: NonNullable<InertiaLinkProps['href']>
    printHref: NonNullable<InertiaLinkProps['href']>
    editHref: NonNullable<InertiaLinkProps['href']>
    editDisabled?: boolean
    idPrefix?: string
}>()

const { isCurrentUrl } = useCurrentUrl()
</script>
<template>
    <div class="btn-group btn-group-sm">
        <Link
            :href="showHref"
            class="btn btn-sm btn-outline-secondary"
            :class="{ active: isCurrentUrl(showHref) }"
            :id="`${idPrefix}unit-controls-view`"
        >
            <PhMonitor :size="16" />
        </Link>

        <Link
            :href="printHref"
            class="btn btn-sm btn-outline-secondary"
            :class="{ active: isCurrentUrl(printHref) }"
            :id="`${idPrefix}unit-controls-print`"
        >
            <PhPrinter :size="16" />
        </Link>

        <Link
            :disabled="editDisabled"
            :href="editHref"
            class="btn btn-sm btn-outline-secondary"
            :class="{
                active: isCurrentUrl(editHref),
                disabled: editDisabled,
            }"
            :id="`${idPrefix}unit-controls-edit`"
        >
            <PhPencilSimple :size="16" />
        </Link>
    </div>

    <BTooltip :target="`${idPrefix}unit-controls-view`"> View </BTooltip>
    <BTooltip :target="`${idPrefix}unit-controls-print`"> Print </BTooltip>
    <BTooltip :target="`${idPrefix}unit-controls-edit`"> Edit </BTooltip>
</template>
