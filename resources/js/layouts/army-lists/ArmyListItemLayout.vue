<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { PhMonitor, PhPencilSimple, PhPrinter } from '@phosphor-icons/vue'
import { BTooltip } from 'bootstrap-vue-next'
import DeleteArmyListModal from '../../components/army-lists/DeleteArmyListModal.vue'
import { useCurrentUrl } from '../../composables/useCurrentUrl'
import ArmyListItemHeader from '../../pages/ArmyLists/Components/ArmyListItemHeader.vue'
import { edit, print, show } from '../../routes/army-lists'
import type { ArmyList } from '../../types/army-list'

const { isCurrentUrl } = useCurrentUrl()
const { armyList, title } = defineProps<{
    armyList: ArmyList
    title: string
}>()
</script>
<template>
    <div>
        <ArmyListItemHeader :title="title" :description="armyList.display_name">
            <div class="btn-group btn-group-sm">
                <Link
                    :href="show(armyList.uuid)"
                    class="btn btn-sm btn-outline-secondary"
                    :class="{active: isCurrentUrl(show(armyList))}"
                    id="unit-controls-view"
                >
                    <PhMonitor :size="16" />
                </Link>

                <Link
                    :href="print(armyList.uuid)"
                    class="btn btn-sm btn-outline-secondary"
                    :class="{active: isCurrentUrl(print(armyList))}"
                    id="unit-controls-print"
                >
                    <PhPrinter :size="16" />
                </Link>

                <Link
                    v-if="armyList.can.update"
                    :href="edit(armyList.uuid)"
                    class="btn btn-sm btn-outline-secondary"
                    :class="{active: isCurrentUrl(edit(armyList))}"
                    id="unit-controls-edit"
                >
                    <PhPencilSimple :size="16" />
                </Link>
            </div>

            <DeleteArmyListModal
                v-if="armyList.can.delete"
                :army-list="armyList"
                class="ms-2"
            />

            <BTooltip target="#unit-controls-view">
                View
            </BTooltip>
            <BTooltip target="#unit-controls-print">
                Print
            </BTooltip>
            <BTooltip target="#unit-controls-edit">
                Edit
            </BTooltip>

        </ArmyListItemHeader>

        <slot />
    </div>
</template>
