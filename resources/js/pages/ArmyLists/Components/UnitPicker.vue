<script setup lang="ts">
import { PhFunnel, PhFunnelX, PhPlus } from '@phosphor-icons/vue'
import { useElementSize } from '@vueuse/core'
import {
    BTable,
    type BTableSortBy,
    type TableFieldRaw,
    type TableRowType,
    type TableStrictClassValue,
    vBTooltip,
} from 'bootstrap-vue-next'
import { computed, ref, useTemplateRef } from 'vue'
import { FACTIONS } from '../../../../data/factions'
import { UNITS } from '../../../../data/units'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import BtnPopoverValidation from '../../../components/ui/BtnPopoverValidation.vue'
import CardHazardTitle from '../../../components/ui/CardHazardTitle.vue'
import TableSortHeader from '../../../components/ui/TableSortHeader.vue'
import { getArmyListMaxPoints, getArmyListTotalPoints } from '../../../composables/useArmyList'
import { useFilterSettings } from '../../../composables/useFilterSettings'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'
import { getArmyListFactionValidator } from '../../../lib/faction-validators'
import { sort } from '../../../lib/utils'
import ButtonToggle from './ButtonToggle.vue'
import UnitGridFilters from './UnitGridFilters.vue'

const { armyList } = defineProps<{
    armyList: LocalArmyList
}>()

const emit = defineEmits<{
    add: [unitId: number]
}>()

type Row = (typeof allUnits)['value'][0]

const validator = computed(() =>
    getArmyListFactionValidator(armyList.faction_id),
)
const hasFaction = computed(() => armyList.faction_id !== FACTIONS.UNAFFILIATED.id)

const allUnits = computed(() => {
    const maxPoints = getArmyListMaxPoints(armyList) ?? 0
    const totalPoints = getArmyListTotalPoints(armyList)
    const remainingPoints = Math.max(maxPoints - totalPoints, 0)

    return Object.values(UNITS)
        .map((u) => {
            const {
                id,
                prefix,
                display_name,
                manufacturer,
                init,
                dodge,
                defense,
                speed,
                hp,
                cost,
                weapons,
                traits,
                abilities,
            } = u

            return {
                id,
                prefix,
                display_name,
                class: u.class,
                manufacturer,
                init,
                dodge,
                defense,
                speed,
                hp,
                cost,
                weapons: weapons.map((w) => ({ ...w })),
                traits: [...traits],
                abilities: [...abilities],
                faction_validation: validator.value.validateUnitCandidate(
                    armyList,
                    u.id,
                ),
            }
        })
        .filter((row) => {
            const valid = !row.faction_validation
            if (filterFactionValidUnits.value && !valid) {
                return false
            }

            if (filterWithinBudgetUnits.value && remainingPoints < row.cost) {
                return false
            }

            return true
        })
})

const fields = computed<Exclude<TableFieldRaw<Row>, string>[]>(() => [
    ...(hasFaction.value && !filterFactionValidUnits.value
        ? [
            {
                key: 'faction_validation',
                label: 'Valid',
                sortable: true,
                sortCompare: sort((unit: Row) =>
                    unit.faction_validation ? 1 : 0,
                ),
                class: 'cell-faction-validation',
            },
        ]
        : []),
    {
        key: 'display_name',
        label: 'Name',
        sortable: true,
        class: 'ws-nowrap',
    },
    ...(showClass.value
        ? [
            {
                key: 'class',
                sortable: true,
            },
        ]
        : []),
    ...(showManufacturer.value
        ? [
            {
                key: 'manufacturer',
                sortable: true,
            },
        ]
        : []),
    {
        key: 'init',
        label: 'Init.',
        class: 'number-cell',
        sortable: true,
    },
    {
        key: 'dodge',
        class: 'number-cell',
        sortable: true,
    },
    {
        key: 'defense',
        class: 'number-cell',
        sortable: true,
    },
    {
        key: 'hp',
        label: 'HP',
        class: 'number-cell',
        sortable: true,
    },
    {
        key: 'speed',
        label: 'Move',
        sortable: true,
        class: 'ws-nowrap number-cell',
    },
    {
        key: 'weapons',
    },
    {
        key: 'traits',
    },
    {
        key: 'abilities',
        class: 'text-teal',
    },
    {
        key: 'cost',
        class: 'number-cell',
        sortable: true,
    },
    {
        key: 'controls',
        label: '',
        class: 'ws-nowrap',
    },
])

const sortBy = ref<BTableSortBy[]>([{ key: 'display_name', order: 'desc' }])

const {
    showClass,
    showManufacturer,
    showPrefix,
    filterFactionValidUnits,
    filterWithinBudgetUnits,
} = useFilterSettings()

const rowClass = (
    item: Row | null,
    type: TableRowType,
): TableStrictClassValue =>
    type === 'row' && item?.faction_validation ? 'row-faction-invalid' : ''

function sortMode(key: string) {
    return sortBy.value.find((s) => s.key === key)?.order
}

const toolbarRef = useTemplateRef<HTMLElement>('toolbar')
const { height: toolbarHeight } = useElementSize(toolbarRef, undefined, {
    box: 'border-box',
})
</script>
<template>
    <div
        class="card mb-3"
        :style="{ '--unit-picker-toolbar-height': `${toolbarHeight}px` }"
    >
        <div class="card-body pt-0">
            <div ref="toolbar" class="unit-picker-toolbar sticky-top">
                <CardHazardTitle title="Recruits" variant="teal">


                    <UnitGridFilters
                        :army-list="armyList"
                        v-model:show-class="showClass"
                        v-model:show-manufacturer="showManufacturer"
                        v-model:show-prefix="showPrefix"
                    >
                        <div class="btn-sm-py ms-2 fw-bold">Filters:</div>
                        <ButtonToggle
                            v-model="filterWithinBudgetUnits"
                            class-off="secondary"
                            size="sm"
                        >
                            <template #icon-on>
                                <PhFunnel weight="fill" />
                            </template>
                            <template #icon-off>
                                <PhFunnelX />
                            </template>
                            Within Available Points
                        </ButtonToggle>
                        <ButtonToggle
                            v-model="filterFactionValidUnits"
                            class-off="secondary"
                            v-if="
                                armyList.faction_id !== FACTIONS.UNAFFILIATED.id
                            "
                            size="sm"
                        >
                            <template #icon-on>
                                <PhFunnel weight="fill" />
                            </template>
                            <template #icon-off>
                                <PhFunnelX />
                            </template>
                            Faction Valid
                        </ButtonToggle>
                    </UnitGridFilters>
                </CardHazardTitle>
            </div>

            <BTable
                striped
                hover
                thead-class="unit-picker-sticky-head"
                class="table-unit-picker table-sortable"
                :items="allUnits"
                :fields="fields"
                v-model:sort-by="sortBy"
                head-variant="dark"
                no-border-collapse
                :tbody-tr-class="rowClass"
                no-sortable-icon
            >
                <template #head()="scope">
                    <TableSortHeader
                        :mode="sortMode(scope.field.key)"
                        :scope="scope"
                        :size="14"
                    />
                </template>

                <template #cell(faction_validation)="data">
                    <BtnPopoverValidation
                        :faction-id="armyList.faction_id"
                        :faction-messages="data.item.faction_validation?.validationMessages"
                    />
                </template>

                <template #cell(display_name)="data">
                    <span class="text-muted fw-light" v-if="showPrefix">{{
                            data.item.prefix
                        }}</span>
                    {{ data.item.display_name }}
                </template>

                <template #cell(weapons)="data">
                    {{ data.item.weapons.map((w: any) => w.name).join(', ') }}
                </template>

                <template #cell(traits)="data">
                    {{ data.item.traits.join(', ') }}
                </template>
                <template #cell(abilities)="data">
                    {{ data.item.abilities.join(', ') }}
                </template>

                <template #cell(controls)="data">
                    <button
                        type="button"
                        class="btn btn-sm btn-primary"
                        @click="emit('add', data.item.id)"
                        v-b-tooltip.hover.top
                        title="Add to List"
                        :disabled="!!data.item.faction_validation"
                    >
                        <PhPlus weight="bold" :size="16" />
                    </button>

                    <UnitCardModal :unit-id="data.item.id" />
                </template>
            </BTable>
        </div>
    </div>
</template>
<style lang="scss">
.unit-picker-toolbar {
    background: var(--bs-card-bg);
    z-index: 3;
    padding-top: var(--bs-card-spacer-y);
}

.unit-picker-sticky-head {
    background: var(--bs-card-bg);

    th {
        position: sticky;
        top: var(--unit-picker-toolbar-height, 0px);
        z-index: 2;
    }
}

.table-unit-picker {
    > tbody > tr.row-faction-invalid {
        &:nth-of-type(odd) > * {
            --bs-table-bg-type: var(--bs-table-bg);
        }

        > td {
            &:not(:has(.btn-popover-validation)) {
                opacity: 0.25;
            }

            &:has(.btn-popover-validation) {
                border-color: color-mix(
                    in srgb,
                    var(--bs-table-border-color) 25%,
                    transparent
                );
            }
        }
    }
}
</style>
