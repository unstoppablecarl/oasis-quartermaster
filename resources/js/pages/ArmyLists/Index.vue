<script setup lang="ts">
import { create } from '@/routes/army-lists'
import type { ArmyList } from '@/types/army-list'
import { Head, Link } from '@inertiajs/vue3'
import { BTooltip } from 'bootstrap-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { computed, toValue } from 'vue'
import Fraction from '../../components/Fraction.vue'
import { getArmyListTypeName, useArmyList } from '../../composables/useArmyList'
import ArmyListControls from './Components/ArmyListControls.vue'
import ArmyListItemHeader from './Components/ArmyListItemHeader.vue'

const { armyLists } = defineProps<{
    armyLists: ArmyList[];
}>()

function timeAgo(val: Date | undefined | null) {
    if (!val) return null
    return formatDistanceToNow(val, { addSuffix: true })
}

function localize(val: Date | undefined | null) {
    if (!val) return null

    return val.toLocaleDateString() + ' ' + val.toLocaleTimeString()
}

const armyListsInfo = computed(() => {
    return armyLists.map(a => {
        const {
            maxPoints,
            totalCost,
            unitCount,
            faction,
            commands,
            createdAt,
            updatedAt,
        } = useArmyList(a)
        return {
            armyList: a,
            display_name: a.display_name,
            type: getArmyListTypeName(a),
            totalCost,
            maxPoints,
            unitCount,
            createdAt,
            updatedAt,
            commands: commands.value.map(c => c.display_name),
            faction: faction.value.display_name,
        }
    })
})
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
            <th>Game Mode</th>
            <th>Faction</th>
            <th>Commands</th>
            <th class="number-cell">Unit Count</th>
            <th class="number-cell">Points</th>
            <th>Created</th>
            <th>Updated</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="armyListsInfo.length === 0">
            <td colspan="3" class="text-secondary text-center">
                No army lists yet.
            </td>
        </tr>
        <tr v-for="item in armyListsInfo" :key="item.armyList.uuid">
            <td class="fw-medium">
                {{ item.display_name }}
            </td>
            <td>
                {{ item.type }}
            </td>
            <td>
                {{ item.faction }}
            </td>
            <td>
                {{ item.commands.join(', ') }}
            </td>
            <td class="number-cell">
                {{ item.unitCount }}
            </td>
            <td class="number-cell">
                <Fraction :a="toValue(item.totalCost)" :b="toValue(item.maxPoints)" />
            </td>
            <td>
                <BTooltip>
                    <template #target>
                        <button role="button" class="btn btn-link p-0">
                            {{ timeAgo(item.createdAt.value) }}
                        </button>
                    </template>
                    {{ localize(item.createdAt.value) }}
                </BTooltip>
            </td>

            <td>
                <BTooltip>
                    <template #target>
                        <button role="button" class="btn btn-link p-0">
                            {{ timeAgo(item.updatedAt.value) }}
                        </button>
                    </template>
                    {{ localize(item.updatedAt.value) }}
                </BTooltip>
            </td>
            <td class="text-end">
                <div class="d-flex justify-content-end gap-2">
                    <ArmyListControls :army-list="item.armyList" />
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>
