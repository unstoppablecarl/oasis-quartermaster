<script setup lang="ts">
import Fraction from '../../../components/Fraction.vue'
import { type UnitEntry, useUnitsInfo } from '../../../composables/useUnitsInfo'

const {
    units,
    showControls = false,
    maxPoints,
} = defineProps<{
    maxPoints: number | null
    units: UnitEntry[]
    showControls?: boolean
}>()

const emit = defineEmits<{
    add: [unitId: number]
    subtract: [unitId: number]
    remove: [unitId: number]
}>()

const { unitsInfo, totalCost } = useUnitsInfo(() => units)
</script>
<template>
    <div class="title pb-2">Units</div>
    <div class="card mb-3">
        <div class="card-body">
            <table class="table table-hover">
                <thead>
                <tr class="small">
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
                <tbody>
                <tr v-for="unit in unitsInfo" :key="unit.id">
                    <td>{{ unit.display_name }}</td>
                    <td class="number-cell">{{ unit.init }}</td>
                    <td class="number-cell">{{ unit.dodge }}</td>
                    <td class="number-cell">{{ unit.defense }}</td>
                    <td class="number-cell">{{ unit.hp }}</td>
                    <td class="number-cell ws-nowrap">{{ unit.speed }}</td>
                    <td></td>
                    <td class="text-teal">{{ unit.traits.join(', ') }}</td>
                    <td>{{ unit.abilities.join(', ') }}</td>

                    <td class="number-cell pe-0 ws-nowrap">{{ unit.cost }} <span class="text-muted">&times;</span></td>
                    <td class="number-cell px-0">{{ unit.quantity }} <span class="text-muted">=</span></td>
                    <td class="number-cell fw-bold">
                        {{ unit.quantity * unit.cost }}
                    </td>
                    <td class="px-0 py-1 ws-nowrap" v-if="showControls">
                        <div class="btn-group btn-group-sm">
                            <button
                                role="button"
                                class="btn btn-secondary"
                                @click="emit('subtract', unit.id)"
                            >
                                -
                            </button>
                            <button
                                role="button"
                                class="btn btn-secondary"
                                @click="emit('add', unit.id)"
                            >
                                +
                            </button>
                        </div>
                        <button
                            role="button"
                            class="btn btn-sm btn-danger ms-1"
                            :disabled="unit.quantity !== 0"
                            @click="emit('remove', unit.id)"
                            :style="`opacity: ${unit.quantity === 0 ? 1 : 0}`"
                        >
                            X
                        </button>
                    </td>
                </tr>
                </tbody>
                <caption class="px-1 fs-5 text-end">
                    Total:
                    <Fraction :a="totalCost" :b="maxPoints" />
                </caption>
            </table>
        </div>
    </div>
</template>
