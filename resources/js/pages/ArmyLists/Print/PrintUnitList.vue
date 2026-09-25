<script setup lang="ts">
import { useArmyList } from '../../../composables/useArmyList'
import { getFactionName } from '../../../lib/static-data-helpers'
import type { ArmyList } from '../../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

const { maxPoints, unitsInfo, totalCost, unitCount } = useArmyList(armyList)

</script>
<template>
    <div
        class="page-preview page-letter padded"
        style="background-color:white"
    >
        <div class="h5 text-dark">{{ armyList.display_name }}</div>
        <div class="h5 text-dark">Faction: {{ getFactionName(armyList.faction_id) }}</div>

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
                <div class="px-2 pt-3 pb-0 text-end">
                    <strong>Unit Count: </strong>
                    <span class="me-3">{{ unitCount }}</span>
                    <strong>Total Cost: </strong>
                    {{ totalCost }} / {{ maxPoints }}
                </div>
            </caption>
        </table>
    </div>
</template>
