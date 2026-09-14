<script setup lang="ts">
import { type UnitEntry, useUnitsInfo } from '../../composables/useUnitsInfo'

const { units, showControls = false } = defineProps<{
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
    <div class="title-font pb-2">Units</div>
    <div class="card">
        <div class="card-body">
            <table class="table w-auto table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th class="number-cell">Cost</th>
                        <th class="px-0"></th>
                        <th class="number-cell">Qty</th>
                        <th class="px-0"></th>
                        <th class="number-cell">Total</th>
                        <th class="px-0" v-if="showControls"></th>
                        <td v-if="showControls"></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in unitsInfo" :key="unit.id">
                        <td>{{ unit.display_name }}</td>

                        <td class="number-cell">{{ unit.cost }}</td>
                        <td class="px-0 text-muted">&times;</td>
                        <td class="number-cell">{{ unit.quantity }}</td>
                        <td class="px-0 text-muted">=</td>
                        <td class="number-cell">
                            {{ unit.quantity * unit.cost }}
                        </td>
                        <td class="px-0" v-if="showControls">
                            <div class="btn-group btn-group-sm">
                                <button
                                    role="button"
                                    class="btn btn-outline-primary"
                                    @click="emit('subtract', unit.id)"
                                >
                                    -
                                </button>
                                <button
                                    role="button"
                                    class="btn btn-outline-primary"
                                    @click="emit('add', unit.id)"
                                >
                                    +
                                </button>
                            </div>
                        </td>
                        <td v-if="showControls">
                            <button
                                role="button"
                                class="btn btn-sm ms-1"
                                :class="{
                                    'btn-danger': unit.quantity === 0,
                                    'btn-outline-danger': unit.quantity !== 0,
                                }"
                                :disabled="unit.quantity !== 0"
                                @click="emit('remove', unit.id)"
                            >
                                X
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="5" class="text-end">Total</th>
                        <th class="number-cell">{{ totalCost }}</th>
                        <th colspan="2" v-if="showControls"></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>
