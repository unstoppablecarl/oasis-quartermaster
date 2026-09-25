<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { PhCopySimple, PhMonitor, PhPencilSimple, PhPrinter } from '@phosphor-icons/vue'
import { BTooltip } from 'bootstrap-vue-next'
import DeleteArmyListModal from '../../../components/army-lists/DeleteArmyListModal.vue'
import { useCurrentUrl } from '../../../composables/useCurrentUrl'
import { duplicate, edit, print, show } from '../../../routes/army-lists'
import type { ArmyList } from '../../../types/army-list'
import BtnCopyLink from './BtnCopyLink.vue'

const { isCurrentUrl } = useCurrentUrl()

const { armyList, idPrefix } = defineProps<{
    armyList: ArmyList
    idPrefix?: string
}>()
</script>
<template>
    <BtnCopyLink v-if="armyList.public" :army-list-uuid="armyList.uuid" class="me-2 btn-sm" />

    <div class="btn-group btn-group-sm">
        <Link
            :href="show(armyList.uuid)"
            class="btn btn-sm btn-outline-secondary"
            :class="{active: isCurrentUrl(show(armyList))}"
            :id="`${idPrefix}unit-controls-view`"
        >
            <PhMonitor :size="16" />
        </Link>

        <Link
            :href="print(armyList.uuid)"
            class="btn btn-sm btn-outline-secondary"
            :class="{active: isCurrentUrl(print(armyList))}"
            :id="`${idPrefix}unit-controls-print`"
        >
            <PhPrinter :size="16" />
        </Link>

        <Link
            :disabled="!armyList.can.update"
            :href="edit(armyList.uuid)"
            class="btn btn-sm btn-outline-secondary"
            :class="{active: isCurrentUrl(edit(armyList)), disabled: !armyList.can.update}"
            :id="`${idPrefix}unit-controls-edit`"
        >
            <PhPencilSimple :size="16" />
        </Link>

        <Link
            :href="duplicate(armyList.uuid)"
            method="post"
            as="button"
            class="btn btn-sm btn-outline-info"
            :id="`${idPrefix}unit-controls-duplicate`"
        >
            <PhCopySimple :size="16" />
        </Link>
    </div>

    <DeleteArmyListModal
        :disabled="!armyList.can.delete"
        :army-list="armyList"
        class="ms-2"
        :id="`${idPrefix}unit-controls-delete`"
    />

    <BTooltip :target="`${idPrefix}unit-controls-view`">
        View
    </BTooltip>
    <BTooltip :target="`${idPrefix}unit-controls-print`">
        Print
    </BTooltip>
    <BTooltip :target="`${idPrefix}unit-controls-edit`">
        Edit
    </BTooltip>
    <BTooltip :target="`${idPrefix}unit-controls-duplicate`">
        Duplicate
    </BTooltip>
</template>
