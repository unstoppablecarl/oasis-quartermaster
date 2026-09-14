<script setup lang="ts">
import DeleteArmyListModal from '@/components/army-lists/DeleteArmyListModal.vue'
import Heading from '@/components/Heading.vue'
import { edit, show } from '@/routes/army-lists'
import type { ArmyList } from '@/types/army-list'
import { Head, Link } from '@inertiajs/vue3'
import { getArmyListMaxPoints, getArmyListTypeName } from '../../composables/useArmyList'

const { armyLists } = defineProps<{
    armyLists: ArmyList[];
}>()
</script>
<template>
    <Head title="Army Lists" />
    <Heading variant="small" title="Army Lists" />

    <table class="table align-middle">
        <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th class="number-cell">Max Points</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="armyLists.length === 0">
            <td colspan="3" class="text-secondary text-center">
                No army lists yet.
            </td>
        </tr>
        <tr v-for="item in armyLists" :key="item.uuid">
            <td class="fw-medium">
                {{ item.display_name }}
            </td>
            <td>
                {{ getArmyListTypeName(item) }}
            </td>
            <td class="number-cell">
                {{ getArmyListMaxPoints(item) }}
            </td>
            <td class="text-end">
                <div class="d-flex justify-content-end gap-2">
                    <div class="btn-group">

                        <Link
                            :href="show(item.uuid)"
                            class="btn btn-sm btn-outline-secondary"
                        >View
                        </Link
                        >
                        <Link
                            v-if="item.can.update"
                            :href="edit(item.uuid)"
                            class="btn btn-sm btn-outline-secondary"
                        >Edit
                        </Link
                        >
                    </div>
                    <DeleteArmyListModal
                        v-if="item.can.delete"
                        :army-list="item"
                    />
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>
