<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import DeleteArmyListModal from '../../components/army-lists/DeleteArmyListModal.vue'
import { useCurrentUrl } from '../../composables/useCurrentUrl'
import ArmyListItemHeader from '../../pages/ArmyLists/Components/ArmyListItemHeader.vue'
import { edit, show } from '../../routes/army-lists'
import type { ArmyList } from '../../types/army-list'

const { isCurrentUrl } = useCurrentUrl()
const { armyList, title } = defineProps<{
    armyList: ArmyList
    title: string
    subTitle?: string
}>()
</script>
<template>
    <div>
        <ArmyListItemHeader :title="title" :sub-title="subTitle" :description="armyList.display_name">
            <div class="btn-group btn-group-sm">
                <Link
                    :href="show(armyList.uuid)"
                    class="btn btn-sm btn-outline-secondary"
                    :class="{active: isCurrentUrl(show(armyList))}"
                >View
                </Link>

                <Link
                    v-if="armyList.can.update"
                    :href="edit(armyList.uuid)"
                    class="btn btn-sm btn-outline-secondary"
                    :class="{active: isCurrentUrl(edit(armyList))}"

                >Edit
                </Link>
            </div>

            <DeleteArmyListModal
                v-if="armyList.can.delete"
                :army-list="armyList"
                class="ms-2"
            />
        </ArmyListItemHeader>

        <slot />
    </div>
</template>
