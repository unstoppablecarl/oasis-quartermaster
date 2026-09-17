<script setup lang="ts">
import { GripVertical, Minus, Plus } from '@lucide/vue'
import { PhX } from '@phosphor-icons/vue'
import { computed } from 'vue'
import draggable from 'vuedraggable'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import Fraction from '../../../components/Fraction.vue'
import { type UnitEntry, useUnitsInfo } from '../../../composables/useUnitsInfo'

const {
    units,
    showControls = false,
    maxPoints,
} = defineProps<{
    maxPoints: number | null
    units: UnitEntry[]
    showControls?: boolean,
}>()

const emit = defineEmits<{
    add: [unitId: number]
    subtract: [unitId: number]
    remove: [unitId: number]
    reorder: [orderedUnitIds: number[]]
}>()

const { unitsInfo, totalCost, unitCount } = useUnitsInfo(() => units, () => maxPoints)

const draggableUnits = computed({
    get: () => unitsInfo.value,
    set: (reordered) => emit('reorder', reordered.map((unit) => unit.id)),
})
</script>
<template>
    <div class="title pb-2">Units</div>
    <div class="card mb-3">
        <div class="card-body">
            <table class="table table-hover table-units mb-0">
                <thead>
                <tr class="small">
                    <th class="px-0" v-if="showControls"></th>
                    <th>Name</th>
                    <th class="number-cell">Init.</th>
                    <th class="number-cell">Dodge</th>
                    <th class="number-cell">Defense</th>
                    <th class="number-cell">HP</th>
                    <th class="number-cell">Speed</th>
                    <th>Weapons</th>
                    <th>Traits</th>
                    <th>Abilities</th>
                    <th class="number-cell ws-nowrap">Pts <span class="text-muted">&times;</span></th>
                    <th class="number-cell px-0 ws-nowrap">Qty <span class="text-muted">=</span></th>
                    <th class="number-cell ps-0">Cost</th>
                    <th class="px-0" v-if="showControls"></th>
                </tr>
                </thead>
                <draggable
                    v-model="draggableUnits"
                    tag="tbody"
                    item-key="id"
                    handle=".drag-handle"
                    ghost-class="unit-row-ghost"
                    :animation="60"
                    :disabled="!showControls"
                >
                    <template #item="{ element: unit }">
                        <tr :class="{ 'table-danger unit-error-row': unit.validationMessages.length }">
                            <td class="p-0 drag-handle-cell" v-if="showControls">
                                <button role="button" class="btn btn-transparent drag-handle d-flex align-items-start">
                                    <GripVertical weight="bold" :size="16" />
                                </button>
                            </td>
                            <td>
                                {{ unit.display_name }}
                                <div v-for="message in unit.validationMessages" :key="message"
                                     class="text-danger small">{{ message }}
                                </div>
                            </td>
                            <td class="number-cell">{{ unit.init }}</td>
                            <td class="number-cell">{{ unit.dodge }}</td>
                            <td class="number-cell">{{ unit.defense }}</td>
                            <td class="number-cell">{{ unit.hp }}</td>
                            <td class="number-cell ws-nowrap">{{ unit.speed }}</td>
                            <td></td>
                            <td class="text-teal">{{ unit.traits.join(', ') }}</td>
                            <td>{{ unit.abilities.join(', ') }}</td>

                            <td class="number-cell pe-0 ws-nowrap">{{ unit.cost }} <span
                                class="text-muted">&times;</span></td>
                            <td class="number-cell px-0">{{ unit.quantity }} <span class="text-muted">=</span></td>
                            <td class="number-cell fw-bold">
                                {{ unit.quantity * unit.cost }}
                            </td>
                            <td class="ps-0 py-1 ws-nowrap" v-if="showControls">
                                <div class="btn-group btn-group-sm">
                                    <button
                                        role="button"
                                        class="btn btn-secondary"
                                        @click="emit('subtract', unit.id)"
                                        :disabled="unit.quantity === 0"
                                    >
                                        <Minus :strokeWidth="2.5" :size="16" />
                                    </button>
                                    <button
                                        role="button"
                                        class="btn btn-secondary"
                                        @click="emit('add', unit.id)"
                                    >
                                        <Plus :strokeWidth="2.5" :size="16" />
                                    </button>
                                </div>

                                <button
                                    role="button"
                                    class="btn btn-sm btn-danger ms-1"
                                    :disabled="unit.quantity !== 0"
                                    @click="emit('remove', unit.id)"
                                    :style="`opacity: ${unit.quantity === 0 ? 1 : 0}`"
                                >
                                    <PhX />
                                </button>

                                <UnitCardModal :unit-id="unit.id" />

                            </td>
                        </tr>
                    </template>
                </draggable>
                <caption class="px-1 pt-3 pb-0 fs-5 text-end">
                    <strong>Unit Count: </strong>
                    <span class="text-body-emphasis me-3">{{ unitCount }}</span>
                    <strong>Total Cost: </strong>
                    <Fraction :a="totalCost" :b="maxPoints" />
                </caption>
            </table>
        </div>
    </div>
</template>
<style lang="scss">

table.table-units {
    thead {
        border-width: 0;

        tr,
        th,
        td {
            border-width: 0;
        }
    }

    tbody {
        border-width: 0;

        tr {
            border-bottom-width: 1px;
            border-top-width: 1px;
        }
    }

    tbody tr:not(.unit-error-row):has(+ tr.unit-error-row) > * {
        border-bottom-width: 0;
    }

    tbody tr.unit-error-row {
        border-color: var(--bs-danger);
        border-width: 0 1px;

        th,
        td {
            border-color: var(--bs-danger);
            border-width: 1px 0;
        }
    }

    tbody tr.unit-row-ghost {
        opacity: 0.5;
        background-color: var(--bs-tertiary-bg);
    }

    .drag-handle-cell {
        width: 1.5rem;
        height: 1px;
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
    }
}
</style>
