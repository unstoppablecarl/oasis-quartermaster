<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { useCurrentUrl } from '../../composables/useCurrentUrl'
import { destroy, edit, show } from '../../routes/army-lists'
import type { ArmyList } from '../../types/army-list'

const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl()
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
                <button
                    v-if="armyList.can.delete"
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    :class="{active: isCurrentUrl(destroy(armyList))}"
                >
                    Delete
                </button>
            </div>
        </div>
        <slot />

    </div>
</template>
