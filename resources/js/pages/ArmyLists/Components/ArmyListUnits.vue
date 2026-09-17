<script setup lang="ts">
import { GripVertical, Minus, Plus, X } from '@lucide/vue'
import { BTooltip } from 'bootstrap-vue-next'
import { computed } from 'vue'
import draggable from 'vuedraggable'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import Fraction from '../../../components/Fraction.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
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

function minus(unit: UnitEntry) {
    if (unit.quantity > 0) {
        emit('subtract', unit.id)
    } else {
        emit('remove', unit.id)
    }
}
</script>
<template>
    <div class="card mb-3">
        <div class="card-body table-units">
            <HazardTitle variant="sulfur">
                Units
            </HazardTitle>
            <draggable
                v-model="draggableUnits"
                item-key="id"
                handle=".drag-handle"
                ghost-class="unit-row-ghost"
                :animation="60"
                :disabled="!showControls"
                class="mb-0 table-grid"
            >
                <template #header>
                    <div class="grid-header">
                        <div class="px-0" :class="{'invisible': !showControls}"></div>
                        <div>Name</div>
                        <div class="number-cell">Init.</div>
                        <div class="number-cell">Dodge</div>
                        <div class="number-cell">Defense</div>
                        <div class="number-cell">HP</div>
                        <div class="number-cell">Speed</div>
                        <div>Weapons</div>
                        <div>Traits</div>
                        <div>Abilities</div>
                        <div class="number-cell px-1">Pts</div>
                        <div class="px-0 text-muted"><span class="text-muted">&times;</span></div>
                        <div class="number-cell px-1">Qty</div>
                        <div class="px-0 text-muted"><span class="text-muted">=</span></div>
                        <div class="number-cell ps-1">Cost</div>
                        <div class="px-0" :class="{'invisible': !showControls}"></div>
                    </div>
                </template>
                <template #item="{ element: unit }">
                    <div class="grid-row" :class="{ 'row-error': unit.validationMessages.length }">
                        <div class="p-0 drag-handle-cell" :class="{
                            'invisible': !showControls,
                            'span-error-row': unit.validationMessages.length > 0
                        }">
                            <button role="button" class="btn btn-transparent drag-handle d-flex align-items-start">
                                <GripVertical weight="bold" :size="16" />
                            </button>
                        </div>
                        <div>
                            {{ unit.display_name }}
                        </div>
                        <div class="number-cell">{{ unit.init }}</div>
                        <div class="number-cell">{{ unit.dodge }}</div>
                        <div class="number-cell">{{ unit.defense }}</div>
                        <div class="number-cell">{{ unit.hp }}</div>
                        <div class="number-cell ws-nowrap">{{ unit.speed }}</div>
                        <div>{{ unit.weapons.map((w: any) => w.name).join(', ') }}</div>
                        <div class="text-teal">{{ unit.traits.join(', ') }}</div>
                        <div>{{ unit.abilities.join(', ') }}</div>

                        <div class="number-cell px-1">{{ unit.cost }}</div>
                        <div class="px-0 text-muted">&times;</div>
                        <div class="number-cell px-1">{{ unit.quantity }}</div>
                        <div class="px-0 text-muted">=</div>
                        <div class="number-cell fw-bold px-1">{{ unit.quantity * unit.cost }}</div>
                        <div class="py-1 ws-nowrap" :class="{'invisible': !showControls}">
                            <div class="btn-group btn-group-sm">
                                <button
                                    role="button"
                                    class="btn btn-minus"
                                    :class="{
                                            'btn-secondary': unit.quantity !== 0,
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
                                    class="btn btn-secondary"
                                    @click="emit('add', unit.id)"
                                    :id="`btn-add-1-${unit.id}`"
                                >
                                    <Plus :strokeWidth="2.5" :size="16" />
                                </button>
                            </div>

                            <BTooltip :target="`#btn-remove-1-${unit.id}`" v-if="unit.quantity !== 0">
                                Remove 1
                            </BTooltip>
                            <BTooltip :target="`#btn-add-1-${unit.id}`">
                                Add 1
                            </BTooltip>
                            <UnitCardModal :unit-id="unit.id" />

                        </div>
                        <div class="error-msg" :class="{'error-msg-empty': !unit.validationMessages.length}">
                            <div v-for="message in unit.validationMessages" :key="message">{{ message }}</div>
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
        40px 2fr max-content max-content max-content max-content max-content
        1fr 1fr 1fr max-content 15px max-content 15px max-content 120px;
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
    }


    .btn-minus {
        transition: border-color 0.3s, background-color 0.3s;
    }

    .grid-header {
        font-weight: bold;
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
