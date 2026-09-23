<script setup lang="ts">
import { create } from '@/routes/army-lists'
import type { ArmyList } from '@/types/army-list'
import { Head, Link } from '@inertiajs/vue3'
import { BTable, type BTableSortBy, BTooltip, type TableFieldRaw, type TableItem } from 'bootstrap-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { computed, ref, toValue } from 'vue'
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

function armyListRow(armyList: ArmyList) {
    const {
        maxPoints,
        totalCost,
        unitCount,
        faction,
        commands,
        createdAt,
        updatedAt,
    } = useArmyList(armyList)
    return {
        armyList,
        display_name: armyList.display_name,
        type: getArmyListTypeName(armyList),
        totalCost,
        maxPoints,
        unitCount,
        createdAt,
        updatedAt,
        commands: commands.value.map(c => c.display_name),
        faction: faction.value.display_name,
    }
}

type ArmyListRow = TableItem<ReturnType<typeof armyListRow>>

const armyListsInfo = computed(() => armyLists.map(armyListRow))

const fields: Exclude<TableFieldRaw<ArmyListRow>, string>[] = [
    {
        key: 'display_name',
        label: 'Name',
        sortable: true,
    },
    {
        key: 'type',
        label: 'Game Mode',
        sortable: true,
    },
    {
        key: 'faction',
        sortable: true,
    },
    {
        key: 'commands',
    },
    {
        key: 'unitCount',
        class: 'number-cell',
        sortable: true,
        sortCompare: sort((r) => r.unitCount.value)
    }, {
        key: 'points',
        class: 'number-cell',
        sortable: true,
        sortCompare: sort((r) => r.totalCost.value)
    },
    {
        key: 'createdAt',
        label: 'Created',
        sortable: true,
        sortCompare: sort((r) => r.createdAt.value!.getTime())
    },
    {
        key: 'updatedAt',
        label: 'Updated',
        sortable: true,
        sortCompare: sort((r) => r.updatedAt.value!.getTime())
    },
    {
        key: 'controls',
        label: '',
    },
]

function sort(getter: (v: ArmyListRow) => number) {
    return (a: ArmyListRow, b: ArmyListRow): number => {
        return getter(a) - getter(b)
    }
}

const sortBy = ref<BTableSortBy[]>([{ key: 'name', order: 'desc' }])
</script>
<template>
    <Head title="Army Lists" />
    <ArmyListItemHeader title="All" description="Army Lists">
        <Link :href="create()" class="btn btn-sm btn-primary">Create New</Link>
    </ArmyListItemHeader>

    <BTable
        striped
        hover
        :items="armyListsInfo"
        :fields="fields"
        responsive="sm"
        v-model:sort-by="sortBy"
    >

        <template #cell(commands)="data">
            {{ data.item.commands.join(', ') }}
        </template>

        <template #cell(points)="data">
            <Fraction :a="toValue(data.item.totalCost)" :b="toValue(data.item.maxPoints)" />
        </template>

        <template #cell(createdAt)="data">
            <BTooltip>
                <template #target>
                    <button role="button" class="btn btn-link p-0">
                        {{ timeAgo(data.item.createdAt.value) }}
                    </button>
                </template>
                {{ localize(data.item.createdAt.value) }}
            </BTooltip>
        </template>

        <template #cell(updatedAt)="data">
            <BTooltip>
                <template #target>
                    <button role="button" class="btn btn-link p-0">
                        {{ timeAgo(data.item.updatedAt.value) }}
                    </button>
                </template>
                {{ localize(data.item.updatedAt.value) }}
            </BTooltip>
        </template>

        <template #cell(controls)="data">
            <div class="d-flex justify-content-end gap-2">
                <ArmyListControls :army-list="data.item.armyList" />
            </div>
        </template>
    </BTable>
</template>
