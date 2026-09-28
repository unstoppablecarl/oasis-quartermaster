<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import { PhCopySimple } from '@phosphor-icons/vue'
import { BTooltip } from 'bootstrap-vue-next'
import { computed } from 'vue'
import DeleteArmyListModal from '../../../components/army-lists/DeleteArmyListModal.vue'
import { duplicate, edit, print, show } from '../../../routes/army-lists'
import type { ArmyList } from '../../../types/army-list'
import ArmyListViewPrintEditLinks from './ArmyListViewPrintEditLinks.vue'
import BtnCopyLink from './BtnCopyLink.vue'

const { armyList, idPrefix } = defineProps<{
    armyList: ArmyList
    idPrefix?: string
}>()

const page = usePage()
const auth = computed(() => page.props.auth)
</script>
<template>
    <BtnCopyLink
        v-if="armyList.public"
        :army-list-uuid="armyList.uuid"
        class="me-2 btn-sm"
        :id="`${idPrefix}unit-controls-copy-url`"
    />

    <ArmyListViewPrintEditLinks
        :show-href="show(armyList.uuid)"
        :print-href="print({ army_list: armyList.uuid })"
        :edit-href="edit(armyList.uuid)"
        :edit-disabled="!armyList.can.update"
        :id-prefix="idPrefix"
    />

    <Link
        v-if="auth.user && (armyList.public || armyList.can.update)"
        :href="duplicate(armyList.uuid)"
        method="post"
        as="button"
        class="btn btn-sm btn-info ms-2"
        :id="`${idPrefix}unit-controls-duplicate`"
    >
        <PhCopySimple :size="16" />
    </Link>

    <DeleteArmyListModal
        :disabled="!armyList.can.delete"
        :army-list="armyList"
        class="ms-2"
        :id="`${idPrefix}unit-controls-delete`"
    />

    <BTooltip :target="`${idPrefix}unit-controls-duplicate`">
        Duplicate
    </BTooltip>

    <BTooltip :target="`${idPrefix}unit-controls-copy-url`">
        Copy Army List URL
    </BTooltip>
</template>
