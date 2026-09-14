<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import DeleteArmyListModal from '../../components/army-lists/DeleteArmyListModal.vue'
import { useCurrentUrl } from '../../composables/useCurrentUrl'
import { edit, show } from '../../routes/army-lists'
import type { ArmyList } from '../../types/army-list'

const { isCurrentUrl } = useCurrentUrl()
const { armyList } = defineProps<{
    armyList: ArmyList;
}>()
</script>
<template>
    <div>
        <div class="d-flex">

            <div class="me-auto">
                {{ armyList.display_name }}
            </div>

            <div class="btn-group">
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
        </div>
        <div class="hazard-rule"></div>
        <slot />
    </div>
</template>
