<script setup lang="ts">
import { create } from '@/routes/army-lists'
import type { ArmyList } from '@/types/army-list'
import { Head, Link } from '@inertiajs/vue3'
import { Plus } from '@lucide/vue'
import {
    BTable,
    type BTableSortBy,
    BTooltip,
    type TableFieldRaw,
    type TableItem,
    vBTooltip,
} from 'bootstrap-vue-next'
import { computed, ref, toValue } from 'vue'
import Fraction from '../../components/Fraction.vue'
import TableSortHeader from '../../components/ui/TableSortHeader.vue'
import { getArmyListTypeName, useArmyList } from '../../composables/useArmyList'
import { localize, sort, timeAgo } from '../../lib/utils'
import ArmyListControls from './Components/ArmyListControls.vue'
import ArmyListItemHeader from './Components/ArmyListItemHeader.vue'

const { armyLists } = defineProps<{
    armyLists: ArmyList[]
}>()

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
        commands: commands.value.map((c) => c.display_name),
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
        class: 'ws-nowrap',
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
        sortCompare: sort((r) => r.unitCount.value),
    },
    {
        key: 'points',
        class: 'number-cell',
        sortable: true,
        sortCompare: sort((r) => r.totalCost.value),
    },
    {
        key: 'createdAt',
        label: 'Created',
        sortable: true,
        sortCompare: sort((r) => r.createdAt.value!.getTime()),
    },
    {
        key: 'updatedAt',
        label: 'Updated',
        sortable: true,
        sortCompare: sort((r) => r.updatedAt.value!.getTime()),
    },
    {
        key: 'controls',
        label: '',
    },
]

const sortBy = ref<BTableSortBy[]>([{ key: 'name', order: 'desc' }])

function sortMode(key: string) {
    return sortBy.value.find((s) => s.key === key)?.order
}
</script>
<template>
    <Head title="Army Lists" />
    <ArmyListItemHeader title="All" description="Army Lists">
        <Link
            :href="create()"
            class="btn btn-sm btn-primary"
            v-b-tooltip.hover.top
            title="Create New Army List"
        >
            <Plus :strokeWidth="2.5" :size="16" />
        </Link>
    </ArmyListItemHeader>

    <Teleport to="#before-page-footer-teleport" defer>
        <div class="container-fluid">
            <BTable
                striped
                hover
                class="table-army-lists table-sortable"
                thead-class="table-army-lists-sticky-head"
                :items="armyListsInfo"
                :fields="fields"
                v-model:sort-by="sortBy"
                responsive="sm"
                no-border-collapse
                no-sortable-icon
            >
                <template #head()="scope">
                    <TableSortHeader
                        :mode="sortMode(scope.field.key)"
                        :scope="scope"
                        :size="14"
                    />
                </template>

                <template #cell(commands)="data">
                    {{ data.item.commands.join(', ') }}
                </template>

                <template #cell(points)="data">
                    <Fraction
                        :a="toValue(data.item.totalCost)"
                        :b="toValue(data.item.maxPoints)"
                    />
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
        </div>
    </Teleport>
</template>
<style lang="scss">
.table-army-lists {
   table > thead > tr {
        > th {
            white-space: nowrap;
        }
    }
}

.table-army-lists-sticky-head {
    background: var(--bs-card-bg);

    border-bottom: 1px solid var(--bs-border-color);

    th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: $bg-main;
        border-bottom: 1px solid var(--bs-border-color);
    }
}
</style>
