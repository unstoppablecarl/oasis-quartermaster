<script setup lang="ts">
import { ChevronDown, ChevronsUpDown, ChevronUp, GripVertical, Minus, Plus, RotateCcw, X } from '@lucide/vue'
import { PhWarning } from '@phosphor-icons/vue'
import { BTooltip } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import Fraction from '../../../components/Fraction.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import { useArmyList } from '../../../composables/useArmyList'
import { type LocalArmyList, type UnitEntry, type UnitEntryInfo } from '../../../composables/useUnitsInfo'

const { armyList } = defineProps<{
    armyList: LocalArmyList,
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
    hasFactionValidationErrors,
} = useArmyList(armyList)

type SortKey = 'display_name' | 'init' | 'dodge' | 'defense' | 'hp' | 'speed' | 'cost' | 'quantity' | 'totalCost' | 'manufacturer'

const sortAccessors: Record<SortKey, (unit: UnitEntryInfo) => string | number | null> = {
    display_name: (unit) => unit.display_name,
    manufacturer: (unit) => unit.manufacturer,
    init: (unit) => unit.init,
    dodge: (unit) => unit.dodge,
    defense: (unit) => unit.defense,
    hp: (unit) => unit.hp,
    speed: (unit) => unit.speed,
    cost: (unit) => unit.cost,
    quantity: (unit) => unit.quantity,
    totalCost: (unit) => unit.quantity * unit.cost,
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
    if (sortKey.value !== key) {
        return ChevronsUpDown
    }

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

function minus(unit: UnitEntry) {
    if (unit.quantity > 0) {
        subtract(unit.id)
    } else {
        remove(unit.id)
    }
}
</script>
<template>
    <div class="card mb-3">
        <div class="card-body table-units">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <HazardTitle variant="sulfur" class="flex-grow-1 mb-0">
                    Units
                </HazardTitle>
                <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary ms-2 text-nowrap"
                    :disabled="!sortKey"
                    @click="resetSort"
                >
                    <RotateCcw :size="14" /> Reset Order
                </button>
            </div>
            <draggable
                v-model="draggableUnits"
                item-key="id"
                handle=".drag-handle"
                ghost-class="unit-row-ghost"
                :animation="60"
                :disabled="sortKey !== null"
                class="mb-0 table-grid"
            >
                <template #header>
                    <div class="grid-header">
                        <div class="px-0"></div>
                        <div class="px-0"></div>
                        <div class="sort-header" :class="{ 'sort-header-active': sortKey === 'display_name' }" @click="toggleSort('display_name')">
                            Name
                            <component :is="sortIconFor('display_name')" :size="14" />
                        </div>
                        <div class="number-cell sort-header" :class="{ 'sort-header-active': sortKey === 'init' }" @click="toggleSort('init')">
                            Init.
                            <component :is="sortIconFor('init')" :size="14" />
                        </div>
                        <div class="number-cell sort-header" :class="{ 'sort-header-active': sortKey === 'dodge' }" @click="toggleSort('dodge')">
                            Dodge
                            <component :is="sortIconFor('dodge')" :size="14" />
                        </div>
                        <div class="number-cell sort-header" :class="{ 'sort-header-active': sortKey === 'defense' }" @click="toggleSort('defense')">
                            Defense
                            <component :is="sortIconFor('defense')" :size="14" />
                        </div>
                        <div class="number-cell sort-header" :class="{ 'sort-header-active': sortKey === 'hp' }" @click="toggleSort('hp')">
                            HP
                            <component :is="sortIconFor('hp')" :size="14" />
                        </div>
                        <div class="number-cell sort-header" :class="{ 'sort-header-active': sortKey === 'speed' }" @click="toggleSort('speed')">
                            Move
                            <component :is="sortIconFor('speed')" :size="14" />
                        </div>
                        <div>Weapons</div>
                        <div>Traits</div>
                        <div class="text-teal">Abilities</div>
                        <div class="number-cell px-1 sort-header" :class="{ 'sort-header-active': sortKey === 'cost' }" @click="toggleSort('cost')">
                            Pts
                            <component :is="sortIconFor('cost')" :size="14" />
                        </div>
                        <div class="px-0 text-muted"><span class="text-muted">&times;</span></div>
                        <div class="number-cell px-1 sort-header" :class="{ 'sort-header-active': sortKey === 'quantity' }" @click="toggleSort('quantity')">
                            Qty
                            <component :is="sortIconFor('quantity')" :size="14" />
                        </div>
                        <div class="px-0 text-muted"><span class="text-muted">=</span></div>
                        <div class="number-cell ps-1 sort-header" :class="{ 'sort-header-active': sortKey === 'totalCost' }" @click="toggleSort('totalCost')">
                            Cost
                            <component :is="sortIconFor('totalCost')" :size="14" />
                        </div>
                        <div class="px-0"></div>
                    </div>
                </template>
                <template #item="{ element: unit }">
                    <div class="grid-row"
                         :class="{ 'row-error': unit.validationMessages.length || unit.factionValidation?.validationMessages?.length }">
                        <div class="p-0 drag-handle-cell" :class="{
                            'span-error-row': unit.validationMessages.length > 0
                        }">
                            <button
                                role="button"
                                class="btn btn-transparent drag-handle d-flex align-items-start"
                                :class="{ 'drag-handle-disabled': sortKey !== null }"
                                :disabled="sortKey !== null"
                            >
                                <GripVertical weight="bold" :size="16" />
                            </button>
                        </div>
                        <div v-if="hasFactionValidationErrors">
                            <BTooltip v-if="unit.factionValidation?.validationMessages?.length">
                                <template #target>
                                    <button role="button" class="btn btn-danger">
                                        <PhWarning weight="fill" />
                                    </button>
                                </template>
                                <div v-for="item in unit.factionValidation.validationMessages">
                                    {{ item }}
                                </div>
                            </BTooltip>
                        </div>
                        <div>
                            <span class="text-muted fw-light">{{ unit.prefix }}</span>

                            {{ unit.display_name }}
                        </div>
                        <div class="number-cell">{{ unit.init }}</div>
                        <div class="number-cell">{{ unit.dodge }}</div>
                        <div class="number-cell">{{ unit.defense }}</div>
                        <div class="number-cell">{{ unit.hp }}</div>
                        <div class="number-cell ws-nowrap">{{ unit.speed }}</div>
                        <div>{{ unit.weapons.map((w: any) => w.name).join(', ') }}</div>
                        <div>{{ unit.traits.join(', ') }}</div>
                        <div class="text-teal">{{ unit.abilities.join(', ') }}</div>

                        <div class="number-cell px-1">{{ unit.cost }}</div>
                        <div class="px-0 text-muted">&times;</div>
                        <div class="number-cell px-1">{{ unit.quantity }}</div>
                        <div class="px-0 text-muted">=</div>
                        <div class="number-cell fw-bold px-1">{{ unit.quantity * unit.cost }}</div>
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
                                    <Minus v-if="unit.quantity !== 0" :strokeWidth="2.5" :size="16" />
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

                            <BTooltip :target="`#btn-remove-1-${unit.id}`" v-if="unit.quantity !== 0">
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
                        <div class="error-msg"
                             :class="{'error-msg-empty': !unit.validationMessages.length && !unit.factionValidation?.validationMessages?.length}">
                            <div v-for="message in unit.validationMessages" :key="message">{{ message }}</div>

                            <div class="text-warning" v-if="unit.factionValidation?.validationMessages?.length">
                                Faction Violations
                            </div>
                            <div v-for="item in unit.factionValidation?.validationMessages">
                                {{ item }}
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>
            <div class="border-top border-bottom py-2 text-center text-teal text-uppercase" v-if="!unitsInfo.length">
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

    .table-grid {
        display: grid;
        grid-template-columns:

        40px repeat(6, max-content)
        1fr 1fr 1fr
        repeat(10, max-content);
    }

    .unit-row-ghost {
        opacity: 0.5;
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


    .btn-minus {
        transition: border-color 0.3s, background-color 0.3s;
    }

    .grid-header {
        font-weight: bold;

        > div {
            color: #fff;
        }

        .sort-header {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            cursor: pointer;
            user-select: none;
            color: var(--bs-secondary-color);

            &:hover {
                color: #fff;
            }

            &.sort-header-active {
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

        > div {
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


        > div.error-msg {
            grid-column: 2 / -1;
            font-size: 0.85em;
            padding-top: 0;
            color: mix($danger, #fff, 50%);
        }

        > div.error-msg-empty {
            padding: 0;
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
}

</style>
