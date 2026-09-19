<script setup lang="ts">
import { type UnitEntry, useUnitsInfo } from '../../../composables/useUnitsInfo'

const {
    units,
    maxPoints,
    displayName,
} = defineProps<{
    maxPoints: number | null
    units: UnitEntry[]
    displayName: string
}>()

const { unitsInfo, totalCost, unitCount } = useUnitsInfo(() => units, () => maxPoints)
</script>
<template>
    <div
        class="page-preview page-letter padded"
        style="background-color:white"
    >
        <div class="h5 text-dark">{{ displayName }}</div>
        <table class="table">
            <thead>
            <tr>
                <th>Name</th>
                <th class="number-cell px-1">Pts</th>
                <th class="px-0 text-muted"><span class="text-muted">&times;</span></th>
                <th class="number-cell px-1">Qty</th>
                <th class="px-0 text-muted"><span class="text-muted">=</span></th>
                <th class="number-cell ps-1">Cost</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="unit in unitsInfo">
                <td>
                    {{ unit.display_name }}
                    <div class="text-danger" v-for="message in unit.validationMessages" :key="message">{{ message }}
                    </div>
                </td>

                <td class="number-cell px-1">{{ unit.cost }}</td>
                <td class="px-0 text-muted">&times;</td>
                <td class="number-cell px-1">{{ unit.quantity }}</td>
                <td class="px-0 text-muted">=</td>
                <td class="number-cell fw-bold ps-1">{{ unit.quantity * unit.cost }}</td>
            </tr>
            </tbody>
            <caption>
                <div class="px-2 pt-3 pb-0 fs-5 text-end">
                    <strong>Unit Count: </strong>
                    <span class="me-3">{{ unitCount }}</span>
                    <strong>Total Cost: </strong>
                    {{ totalCost }} / {{ maxPoints }}
                </div>
            </caption>
        </table>
    </div>
</template>
