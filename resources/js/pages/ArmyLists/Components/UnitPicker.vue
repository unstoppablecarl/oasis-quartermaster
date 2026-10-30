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
import { type UnitId, UNITS } from '../../../../data/units'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import BtnPopoverValidation from '../../../components/ui/BtnPopoverValidation.vue'
import CardHazardTitle from '../../../components/ui/CardHazardTitle.vue'
import TableSortHeader from '../../../components/ui/TableSortHeader.vue'
import { usePersistentSettings } from '../../../composables/usePersistentSettings'
import { hasValidationMessages, validateUnitCandidate } from '../../../lib/army-list-validation'
import { getArmyListMaxPoints, getArmyListTotalPoints } from '../../../lib/static-data-helpers'
import { sort } from '../../../lib/utils'
import type { LocalArmyList } from '../../../types/army-list'
import ButtonToggle from './ButtonToggle.vue'
import UnitGridFilters from './UnitGridFilters.vue'

const { armyList } = defineProps<{
    armyList: LocalArmyList
}>()

const emit = defineEmits<{
    add: [unitId: UnitId]
}>()

type Row = (typeof allUnits)['value'][0]

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
                move,
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
                move,
                hp,
                cost,
                weapons: weapons.map((w) => ({ ...w })),
                traits: [...traits],
                abilities: [...abilities],
                validation: validateUnitCandidate(armyList, id),
            }
        })
        .filter((row) => {
            if (filterFactionValidUnits.value && !row.validation.allowed) {
                return false
            }

            if (filterWithinBudgetUnits.value && remainingPoints < row.cost) {
                return false
            }

            return true
        })
})

const fields = computed<Exclude<TableFieldRaw<Row>, string>[]>(() => [
    {
        key: 'validation',
        label: 'Valid',
        class: 'stacked-unlabeled stacked-validation',
        sortable: true,
        sortCompare: sort((unit: Row) =>
            hasValidationMessages(unit.validation) ? 1 : 0,
        ),
    },
    {
        key: 'display_name',
        label: 'Name',
        sortable: true,
        class: 'ws-nowrap stacked-unlabeled stacked-name',
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
        class: 'number-cell stacked-stat',
        sortable: true,
    },
    {
        key: 'dodge',
        class: 'number-cell stacked-stat',
        sortable: true,
    },
    {
        key: 'defense',
        class: 'number-cell stacked-stat',
        sortable: true,
    },
    {
        key: 'hp',
        label: 'HP',
        class: 'number-cell stacked-stat',
        sortable: true,
    },
    {
        key: 'move',
        label: 'Move',
        sortable: true,
        class: 'ws-nowrap number-cell stacked-stat',
    },
    {
        key: 'weapons',
        class: 'stacked-full',
    },
    {
        key: 'traits',
        class: 'stacked-full',
    },
    {
        key: 'abilities',
        class: 'text-teal stacked-full',
    },
    {
        key: 'cost',
        class: 'number-cell stacked-cost',
        sortable: true,
    },
    {
        key: 'controls',
        label: '',
        class: 'ws-nowrap stacked-unlabeled stacked-controls',
    },
])

const sortBy = ref<BTableSortBy[]>([{ key: 'display_name', order: 'asc' }])

const {
    showClass,
    showManufacturer,
    showPrefix,
    filterFactionValidUnits,
    filterWithinBudgetUnits,
} = usePersistentSettings()

const rowClass = (
    item: Row | null,
    type: TableRowType,
): TableStrictClassValue =>
    type === 'row' && item && hasValidationMessages(item.validation) ? 'row-error' : ''

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
                        <div class="d-flex flex-wrap gap-2">
                            <div class="btn-sm-py fw-bold">Filters:</div>
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
                        </div>
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
                stacked="lg"
                head-variant="dark"
                no-border-collapse
                :tbody-tr-class="rowClass"
                no-sortable-icon
                show-empty
            >
                <template #empty>
                    <div class="py-2 text-center text-teal text-uppercase">
                        No units match the selected filters
                    </div>
                </template>

                <template #head()="scope">
                    <TableSortHeader
                        :mode="sortMode(scope.field.key)"
                        :scope="scope"
                        :size="14"
                    />
                </template>

                <template #cell(validation)="data">
                    <BtnPopoverValidation
                        :unit-id="data.item.id"
                        :faction-id="armyList.faction_id"
                        :validation="data.item.validation"
                    />
                </template>

                <template #cell(display_name)="data">
                    <span class="text-muted fw-light" v-if="showPrefix">
                        {{ data.item.prefix }}
                    </span>
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
    $border-color: mix($danger, #000, 70%);

    > tbody > tr.row-error {
        --bs-table-bg: #{$table-bg-error};

        > td {
            --bs-table-bg: #{$table-bg-error};

            border-color: $border-color;

            &:first-child {
                border-left-width: 1px;
            }

            &:last-child {
                border-right-width: 1px;
            }
        }
    }

    /* The first row has no row above it to provide a top border */
    > tbody > tr.row-error:first-child > td {
        border-top-width: 1px;
    }

    /* Gives the .row-error a top border by coloring the bottom border of the row above it */
    > tbody > tr:has(+ tr.row-error) > td {
        border-bottom-color: $border-color;
    }

    /* Stacked (mobile) layout: each row becomes a compact card */
    @include media-breakpoint-down(lg) {
        &.table.b-table.b-table-stacked-lg > tbody > tr {
            display: grid;
            grid-template-columns: repeat(30, minmax(0, 1fr));
            border-bottom: 1px solid var(--bs-border-color);

            /* Paint the row (not the cells) so gaps between grid cells share the stripe/hover colors */
            background-color: var(--bs-table-bg);
            box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));

            &:nth-of-type(#{$table-striped-order}) {
                --bs-table-bg-type: var(--bs-table-striped-bg);
            }

            &:hover {
                --bs-table-bg-state: var(--bs-table-hover-bg);
            }

            &.row-error {
                border: 1px solid $border-color;
            }

            > td {
                background-color: transparent;
                box-shadow: none;
                grid-column: span 15;
                border: 0;
                padding: 0.25rem 0.5rem;
                text-align: left;

                &::before {
                    float: none;
                    width: auto;
                    text-align: center;
                    padding-right: 0.25rem;
                    color: var(--bs-secondary-color);
                }

                &::after {
                    content: none;
                }

                > div {
                    width: auto;
                    padding: 0;
                }
            }

            > td.stacked-unlabeled::before {
                content: none;
            }

            > td:first-child {
                grid-column: span 4;
            }

            /* Must follow td:first-child, which has equal specificity */
            &.b-table-empty-row > td {
                grid-column: 1 / -1;
            }

            > td.stacked-name {
                grid-column: span 26;
                align-self: center;
                font-weight: bold;
                white-space: normal;
            }

            /* Valid units render no validation button; let the name take the full row */
            > td.stacked-validation:not(:has(.btn-popover-validation)) {
                display: none;

                + td.stacked-name {
                    grid-column: 1 / -1;
                }
            }

            > td.stacked-stat {
                grid-column: span 6;
                text-align: center;

                &::before {
                    display: block;
                    font-size: 0.8em;
                    padding-right: 0;
                }

                &:nth-child(1 of .stacked-stat) {
                    grid-column: 1 / span 6;
                }
            }

            > td.stacked-full {
                grid-column: 1 / -1;
            }

            > td.stacked-cost {
                grid-column: 1 / span 15;
                align-self: center;
            }

            > td.stacked-controls {
                text-align: right;
            }
        }
    }
}
</style>
