<script setup lang="ts">
import { PhEye, PhEyeSlash, PhFunnel, PhFunnelX, PhPlus } from '@phosphor-icons/vue'
import {
    BTable,
    type BTableSortBy,
    type TableFieldRaw,
    type TableRowType,
    type TableStrictClassValue,
    vBTooltip,
} from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { FACTIONS } from '../../../../data/factions'
import { UNITS } from '../../../../data/units'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import BtnPopoverValidation from '../../../components/ui/BtnPopoverValidation.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import TableSortHeader from '../../../components/ui/TableSortHeader.vue'
import { getArmyListMaxPoints, getArmyListTotalPoints } from '../../../composables/useArmyList'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'
import { getArmyListFactionValidator } from '../../../lib/faction-validators'
import { sort } from '../../../lib/utils'
import ButtonToggle from './ButtonToggle.vue'

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
const hasFaction = computed(
    () => armyList.faction_id !== FACTIONS.UNAFFILIATED.id,
)

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
const showPrefix = ref(true)
const showManufacturer = ref(true)
const showClass = ref(true)
const filterWithinBudgetUnits = ref(true)
const filterFactionValidUnits = ref(false)

const rowClass = (
    item: Row | null,
    type: TableRowType,
): TableStrictClassValue =>
    type === 'row' && item?.faction_validation ? 'row-faction-invalid' : ''

function sortMode(key: string) {
    return sortBy.value.find((s) => s.key === key)?.order
}
</script>
<template>
    <div class="card mb-3">
        <div class="card-body pt-0">
            <div class="unit-picker-toolbar sticky-top">
                <HazardTitle variant="teal"> Recruits</HazardTitle>

                <div class="d-flex gap-2 my-2">
                    <div class="btn-py fw-bold">Columns:</div>
                    <ButtonToggle
                        v-model="showPrefix"
                        class-on="success"
                        class-off="info"
                    >
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Prefix
                    </ButtonToggle>
                    <ButtonToggle
                        v-model="showClass"
                        class-on="success"
                        class-off="info"
                    >
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Class
                    </ButtonToggle>
                    <ButtonToggle
                        v-model="showManufacturer"
                        class-on="success"
                        class-off="info"
                    >
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Manufacturer
                    </ButtonToggle>
                    <div class="btn-py ms-2">Filter Rows:</div>
                    <ButtonToggle
                        v-model="filterWithinBudgetUnits"
                        class-off="secondary"
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
                        v-if="armyList.faction_id !== FACTIONS.UNAFFILIATED.id"
                    >
                        <template #icon-on>
                            <PhFunnel weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhFunnelX />
                        </template>
                        Faction Valid
                    </ButtonToggle>
                </div>
            </div>

            <BTable
                striped
                hover
                thead-class="unit-picker-sticky-head"
                class="table-unit-picker"
                :items="allUnits"
                :fields="fields"
                v-model:sort-by="sortBy"
                head-variant="dark"
                no-border-collapse
                :tbody-tr-class="rowClass"
                no-sortable-icon
            >
                <template #head()="scope">
                    <TableSortHeader :mode="sortMode(scope.field.key)" :scope="scope" :size="14" />
                </template>

                <template #cell(faction_validation)="data">
                    <BtnPopoverValidation :faction-messages="data.item.faction_validation?.validationMessages" />
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

/* Sticks the table header just below the toolbar above it, instead of at the very top of the viewport. */
:deep(.unit-picker-sticky-head th) {
    position: sticky;
    top: 5.125rem;
    z-index: 2;
}

:deep(.sort-icon) {
    vertical-align: -0.15em;
    margin-left: 0.25rem;
}

.table-unit-picker {
    > thead > tr {
        > th {
            white-space: nowrap;
        }
        > th.b-table-sortable-column:hover {
            background: $table-th-sortable-hover-bg;
            color: $table-th-sortable-hover-color;
        }
        > th[aria-sort='ascending'],
        > th[aria-sort='descending']{
            color: var(--bs-primary);
        }
    }

    &.table-hover > tbody > tr.row-faction-invalid {
        > td {
            --bs-table-bg-state: var(--bs-table-bg);
        }
    }

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
