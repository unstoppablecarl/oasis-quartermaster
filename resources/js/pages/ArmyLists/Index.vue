<script setup lang="ts">
import { create } from '@/routes/army-lists'
import type { ArmyList } from '@/types/army-list'
import { Head, Link } from '@inertiajs/vue3'
import { getArmyListMaxPoints, getArmyListTypeName } from '../../composables/useArmyList'
import ArmyListControls from './Components/ArmyListControls.vue'
import ArmyListItemHeader from './Components/ArmyListItemHeader.vue'

const { armyLists } = defineProps<{
    armyLists: ArmyList[];
}>()
</script>
<template>
    <Head title="Army Lists" />
    <ArmyListItemHeader title="All" description="Army Lists">
        <Link :href="create()" class="btn btn-sm btn-primary">Create New</Link>
    </ArmyListItemHeader>

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
                    <ArmyListControls :army-list="item" />
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>
