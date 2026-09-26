<script setup lang="ts">
import {
    ChevronDown,
    ChevronsUpDown,
    ChevronUp,
    GripVertical,
    Minus,
    Plus,
    RotateCcw,
    X,
} from '@lucide/vue'
import { PhEquals, PhX } from '@phosphor-icons/vue'
import { useElementSize } from '@vueuse/core'
import { BTooltip } from 'bootstrap-vue-next'
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import draggable from 'vuedraggable'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import Fraction from '../../../components/Fraction.vue'
import CardHazardTitle from '../../../components/ui/CardHazardTitle.vue'
import ValidationMessages from '../../../components/ui/ValidationMessages.vue'
import { useArmyList } from '../../../composables/useArmyList'
import { useFilterSettings } from '../../../composables/useFilterSettings'
import {
    type LocalArmyList,
    type UnitEntry,
} from '../../../composables/useUnitsInfo'
import UnitGridFilters from './UnitGridFilters.vue'

const { armyList } = defineProps<{
    armyList: LocalArmyList
}>()

const {
    add,
    subtract,
    remove,
    reorder,
    totalCost,
    unitCount,
    maxPoints,
    unitsInfo,
} = useArmyList(armyList)

type SortKey =
    | 'display_name'
    | 'init'
    | 'dodge'
    | 'defense'
    | 'hp'
    | 'move'
    | 'cost'
    | 'quantity'
    | 'totalCost'
    | 'manufacturer'
    | 'class'

type Row = (typeof unitsInfo.value)[0]

const sortAccessors: Record<SortKey, (unit: Row) => string | number | null> = {
    display_name: (unit) => unit.display_name,
    manufacturer: (unit) => unit.manufacturer,
    init: (unit) => unit.init,
    dodge: (unit) => unit.dodge,
    defense: (unit) => unit.defense,
    hp: (unit) => unit.hp,
    move: (unit) => unit.move,
    cost: (unit) => unit.cost,
    quantity: (unit) => unit.quantity,
    totalCost: (unit) => unit.quantity * unit.cost,
    class: (unit) => unit.class,
}

const sortKey = ref<SortKey | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')

function toggleSort(key: SortKey) {
    if (sortKey.value !== key) {
        sortKey.value = key
        sortDir.value = 'asc'
        return
    }

    if (sortDir.value === 'asc') {
        sortDir.value = 'desc'
        return
    }

    sortKey.value = null
    sortDir.value = 'asc'
}

function resetSort() {
    sortKey.value = null
    sortDir.value = 'asc'
}

function sortIconFor(key: SortKey) {
    if (sortKey.value !== key) return ChevronsUpDown

    return sortDir.value === 'asc' ? ChevronUp : ChevronDown
}

const sortedUnitsInfo = computed(() => {
    if (!sortKey.value) {
        return unitsInfo.value
    }

    const accessor = sortAccessors[sortKey.value]
    const direction = sortDir.value === 'asc' ? 1 : -1

    return [...unitsInfo.value].sort((a, b) => {
        const aVal = accessor(a)
        const bVal = accessor(b)

        if (aVal === null || bVal === null) {
            return aVal === bVal ? 0 : aVal === null ? 1 : -1
        }

        if (typeof aVal === 'string' || typeof bVal === 'string') {
            return String(aVal).localeCompare(String(bVal)) * direction
        }

        return (aVal - bVal) * direction
    })
})

const draggableUnits = computed({
    get: () => sortedUnitsInfo.value,
    set: (reordered) => reorder(reordered.map((unit) => unit.id)),
})

const isDragging = ref(false)

function stopDragging() {
    isDragging.value = false
}

function onDragEnd() {
    // Keep the handles inert until the mouse actually moves again, otherwise
    // whatever row just shifted under the (stationary) cursor gets a phantom hover.
    window.addEventListener('pointermove', stopDragging, { once: true })
}

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', stopDragging)
})

function minus(unit: UnitEntry) {
    if (unit.quantity > 0) {
        subtract(unit.id)
    } else {
        remove(unit.id)
    }
}

const { showClass, showManufacturer, showPrefix } = useFilterSettings()
const gridTemplateColumns = computed(() => {
    const columns = ['40px', 'max-content']

    if (showClass.value) {
        columns.push('min-content')
    }

    if (showManufacturer.value) {
        columns.push('min-content')
    }

    columns.push(
        'max-content',
        'max-content',
        'max-content',
        'max-content',
        'max-content',
        '1fr',
        '1fr',
        '1fr',
        'max-content',
        'max-content',
        'max-content',
        '1fr',
    )

    return columns.join(' ')
})

const toolbarRef = useTemplateRef<HTMLElement>('toolbar')
const { height: toolbarHeight } = useElementSize(toolbarRef, undefined, {
    box: 'border-box',
})
</script>
<template>
    <div
        class="card mb-3"
        :style="{ '--unit-list-toolbar-height': `${toolbarHeight}px` }"
    >
        <div class="card-body table-units pt-0">
            <div ref="toolbar" class="unit-list-toolbar sticky-top">
                <CardHazardTitle title="Units" variant="sulfur">
                    <UnitGridFilters
                        :army-list="armyList"
                        v-model:show-class="showClass"
                        v-model:show-manufacturer="showManufacturer"
                        v-model:show-prefix="showPrefix"
                    />
                </CardHazardTitle>
            </div>

            <draggable
                v-model="draggableUnits"
                item-key="id"
                handle=".drag-handle"
                ghost-class="unit-row-ghost"
                :animation="60"
                :disabled="sortKey !== null"
                class="mb-0 table-grid"
                :class="{ 'is-dragging': isDragging }"
                drag-class="unit-row-dragging"
                chosen-class="unit-row-chosen"
                :style="{ gridTemplateColumns }"
                @start="isDragging = true"
                @end="onDragEnd"
            >
                <template #header>
                    <div class="grid-header border-bottom">
                        <div class="px-0 text-center">
                            <BTooltip>
                                <template #target>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-secondary"
                                        :class="{ invisible: !sortKey }"
                                        :disabled="!sortKey"
                                        @click="resetSort"
                                    >
                                        <RotateCcw :size="14" />
                                    </button>
                                </template>
                                Reset Order
                            </BTooltip>
                        </div>
                        <div
                            class="sort-header"
                            :class="{
                                'sort-header-active':
                                    sortKey === 'display_name',
                            }"
                            @click="toggleSort('display_name')"
                        >
                            Name
                            <component
                                :is="sortIconFor('display_name')"
                                :size="14"
                            />
                        </div>
                        <div
                            v-if="showClass"
                            class="sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'class',
                            }"
                            @click="toggleSort('class')"
                        >
                            Class
                            <component :is="sortIconFor('class')" :size="14" />
                        </div>
                        <div
                            v-if="showManufacturer"
                            class="sort-header"
                            :class="{
                                'sort-header-active':
                                    sortKey === 'manufacturer',
                            }"
                            @click="toggleSort('manufacturer')"
                        >
                            Manufacturer
                            <component
                                :is="sortIconFor('manufacturer')"
                                :size="14"
                            />
                        </div>
                        <div
                            class="number-cell sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'init',
                            }"
                            @click="toggleSort('init')"
                        >
                            Init.
                            <component :is="sortIconFor('init')" :size="14" />
                        </div>
                        <div
                            class="number-cell sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'dodge',
                            }"
                            @click="toggleSort('dodge')"
                        >
                            Dodge
                            <component :is="sortIconFor('dodge')" :size="14" />
                        </div>
                        <div
                            class="number-cell sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'defense',
                            }"
                            @click="toggleSort('defense')"
                        >
                            Defense
                            <component
                                :is="sortIconFor('defense')"
                                :size="14"
                            />
                        </div>
                        <div
                            class="number-cell sort-header"
                            :class="{ 'sort-header-active': sortKey === 'hp' }"
                            @click="toggleSort('hp')"
                        >
                            HP
                            <component :is="sortIconFor('hp')" :size="14" />
                        </div>
                        <div
                            class="number-cell sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'move',
                            }"
                            @click="toggleSort('move')"
                        >
                            Move
                            <component :is="sortIconFor('move')" :size="14" />
                        </div>
                        <div>Weapons</div>
                        <div>Traits</div>
                        <div class="text-teal">Abilities</div>
                        <div
                            class="number-cell px-1 sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'cost',
                            }"
                            @click="toggleSort('cost')"
                        >
                            Pts
                            <component :is="sortIconFor('cost')" :size="14" />
                        </div>
                        <div
                            class="number-cell px-1 sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'quantity',
                            }"
                            @click="toggleSort('quantity')"
                        >
                            Qty
                            <component
                                :is="sortIconFor('quantity')"
                                :size="14"
                            />
                        </div>
                        <div
                            class="number-cell ps-1 sort-header"
                            :class="{
                                'sort-header-active': sortKey === 'totalCost',
                            }"
                            @click="toggleSort('totalCost')"
                        >
                            Cost
                            <component
                                :is="sortIconFor('totalCost')"
                                :size="14"
                            />
                        </div>
                        <div class="px-0"></div>
                    </div>
                </template>
                <template #item="{ element: unit }">
                    <div
                        class="grid-row"
                        :class="{
                            'row-error':
                                unit.validationMessages.length ||
                                unit.factionValidation?.validationMessages
                                    ?.length,
                        }"
                    >
                        <div
                            class="p-0 drag-handle-cell"
                            :class="{
                                'span-error-row':
                                    unit.validationMessages.length ||
                                    unit.factionValidation?.validationMessages
                                        ?.length,
                            }"
                        >
                            <button
                                role="button"
                                class="btn btn-transparent drag-handle d-flex align-items-start"
                                :class="{
                                    'drag-handle-disabled': sortKey !== null,
                                }"
                                :disabled="sortKey !== null"
                            >
                                <GripVertical weight="bold" :size="16" />
                            </button>
                        </div>
                        <div>
                            <span
                                v-if="showPrefix"
                                class="text-muted fw-light"
                                >{{ unit.prefix }}</span
                            >
                            {{ unit.display_name }}
                        </div>
                        <div v-if="showClass">{{ unit.class }}</div>
                        <div v-if="showManufacturer">
                            {{ unit.manufacturer }}
                        </div>
                        <div class="number-cell-sortable">{{ unit.init }}</div>
                        <div class="number-cell-sortable">{{ unit.dodge }}</div>
                        <div class="number-cell-sortable">
                            {{ unit.defense }}
                        </div>
                        <div class="number-cell-sortable">{{ unit.hp }}</div>
                        <div class="number-cell-sortable ws-nowrap">
                            {{ unit.move }}
                        </div>
                        <div>
                            {{
                                unit.weapons.map((w: any) => w.name).join(', ')
                            }}
                        </div>
                        <div>{{ unit.traits.join(', ') }}</div>
                        <div class="text-teal">
                            {{ unit.abilities.join(', ') }}
                        </div>

                        <div class="number-cell px-1">
                            {{ unit.cost }}
                            <PhX :size="14" />
                        </div>
                        <div class="number-cell px-1">
                            {{ unit.quantity }}
                            <PhEquals :size="14" />
                        </div>
                        <div class="number-cell-sortable fw-bold ps-1">
                            {{ unit.quantity * unit.cost }}
                        </div>
                        <div class="py-1">
                            <div class="btn-group btn-group-sm me-1">
                                <button
                                    role="button"
                                    class="btn btn-minus btn-sm"
                                    :class="{
                                        'btn-primary': unit.quantity !== 0,
                                        'btn-danger': unit.quantity === 0,
                                    }"
                                    @click="minus(unit)"
                                    :id="`btn-remove-1-${unit.id}`"
                                >
                                    <Minus
                                        v-if="unit.quantity !== 0"
                                        :strokeWidth="2.5"
                                        :size="16"
                                    />
                                    <X v-else :strokeWidth="2.5" :size="16" />
                                </button>
                                <button
                                    role="button"
                                    class="btn btn-primary btn-sm"
                                    @click="add(unit.id)"
                                    :id="`btn-add-1-${unit.id}`"
                                >
                                    <Plus :strokeWidth="2.5" :size="16" />
                                </button>
                            </div>

                            <button
                                role="button"
                                class="btn btn-danger btn-sm"
                                @click="remove(unit.id)"
                                :id="`btn-remove-all-${unit.id}`"
                            >
                                <X :strokeWidth="2.5" :size="16" />
                            </button>

                            <BTooltip
                                :target="`#btn-remove-1-${unit.id}`"
                                v-if="unit.quantity !== 0"
                            >
                                Remove 1
                            </BTooltip>
                            <BTooltip :target="`#btn-add-1-${unit.id}`">
                                Add 1
                            </BTooltip>
                            <BTooltip :target="`#btn-remove-all-${unit.id}`">
                                Remove All
                            </BTooltip>

                            <UnitCardModal :unit-id="unit.id" />
                        </div>
                        <div
                            class="error-msg"
                            :class="{
                                'error-msg-empty':
                                    !unit.validationMessages.length &&
                                    !unit.factionValidation?.validationMessages
                                        ?.length,
                            }"
                        >
                            <ValidationMessages
                                :faction-id="armyList.faction_id"
                                :messages="unit.validationMessages"
                                :faction-messages="
                                    unit.factionValidation?.validationMessages
                                "
                                heading-class="text-warning fw-bold"
                            />
                        </div>
                    </div>
                </template>
            </draggable>
            <div
                class="border-top border-bottom py-2 text-center text-teal text-uppercase"
                v-if="!unitsInfo.length"
            >
                No units added yet
            </div>
            <div class="px-2 pt-3 pb-0 fs-5 text-end">
                <strong>Unit Count: </strong>
                <span class="text-body-emphasis me-3">{{ unitCount }}</span>
                <strong>Total Cost: </strong>
                <Fraction :a="totalCost" :b="maxPoints" />
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.table-units {
    .unit-list-toolbar {
        background: var(--bs-card-bg);
        padding-top: var(--bs-card-spacer-y);
        z-index: 3;
    }

    .table-grid {
        display: grid;
    }

    .unit-row-ghost {
        opacity: 0.75;
        background-color: var(--bs-tertiary-bg);
    }

    .drag-handle-cell {
        width: 1.5rem;
    }

    .drag-handle {
        color: var(--bs-secondary-color);
        border-radius: 0;
        line-height: 1;
        cursor: grab;
        height: 100%;
        display: block;
        padding-top: 0.6rem;

        svg {
            vertical-align: top;
        }

        &.drag-handle-disabled {
            cursor: not-allowed;
            opacity: 0.4;
        }
    }

    .table-grid.is-dragging .drag-handle {
        pointer-events: none;
    }

    .btn-minus {
        transition:
            border-color 0.3s,
            background-color 0.3s;
    }

    .grid-header {
        font-weight: bold;
        position: sticky;
        top: var(--unit-list-toolbar-height, 0px);
        z-index: 2;
        background: var(--bs-card-bg);

        > div {
            color: #fff;
            display: flex;
            align-items: center;
        }

        .sort-header {
            gap: 0.25rem;
            cursor: pointer;
            user-select: none;

            &.sort-header:hover {
                background: $table-th-sortable-hover-bg;
                color: $table-th-sortable-hover-color;
            }

            &:hover {
                color: #fff;
            }

            &.sort-header.sort-header-active {
                color: var(--bs-primary);
            }
        }

        .number-cell.sort-header {
            justify-content: flex-end;
        }
    }

    .grid-header,
    .grid-row {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;

        > * {
            padding: 0.5rem;
        }
    }

    .grid-row {
        border-color: var(--bs-border-color);
        border-width: 0 0 1px 0;
        border-style: solid;

        &:first-child {
            border-top-width: 1px;
        }

        &.unit-row-dragging {
            opacity: 0.95;
            background: var(--bs-card-bg);
            border: 1px solid var(--bs-card-border-color);
        }

        > div.error-msg {
            grid-column: 2 / -1;
            font-size: 0.85em;
            padding-top: 0;
            color: mix($danger, #fff, 50%);
        }

        > div.error-msg-empty {
            padding: 0;
        }

        > div.number-cell-sortable {
            text-align: right;
            padding-right: calc(14px + 0.5rem);
        }
    }

    .row-error {
        --bs-border-color: var(--bs-danger);
        border-width: 1px;
        background: mix($danger, $body-bg-dark, 10%);

        /* Selects the .row-error that is immediately followed by a .row-error */
        &:has(+ .row-error):not(:first-child) {
            border-bottom-width: 0;
        }
    }

    .span-error-row {
        grid-row: span 2;
    }

    .spacer {
        width: 14px;
        height: 14px;
        display: inline-block;
    }
}
</style>
