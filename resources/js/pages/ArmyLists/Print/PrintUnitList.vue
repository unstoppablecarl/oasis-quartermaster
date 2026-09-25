<script setup lang="ts">
import ValidationMessages from '../../../components/ui/ValidationMessages.vue'
import { useArmyList } from '../../../composables/useArmyList'
import { getFactionName } from '../../../lib/static-data-helpers'
import type { ArmyList } from '../../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

const { maxPoints, unitsInfo, totalCost, unitCount, commands } =
    useArmyList(armyList)
</script>
<template>
    <div
        class="page-preview page-letter padded print-unit-list"
        style="background-color: white"
    >
        <div class="h5 text-dark ps-2">{{ armyList.display_name }}</div>
        <div
            class="d-flex justify-content-between border-bottom pb-1 mb-1 px-2"
        >
            <div class="text-dark">
                <strong>Faction: </strong>
                {{ getFactionName(armyList.faction_id) }}
            </div>
            <div class="text-dark ms-3">
                <strong>Commands: </strong>
                {{ commands.map((c) => c.display_name).join(', ') }}
            </div>
            <div class="text-dark ms-3">
                <strong>Unit Count: </strong>
                <span class="me-3">{{ unitCount }}</span>
                <strong>Total Cost: </strong>
                {{ totalCost }} / {{ maxPoints }}
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th class="expand">Name</th>
                    <th class="number-cell px-1 shrink">Pts</th>
                    <th class="px-0 text-muted shrink">
                        <span class="text-muted">&times;</span>
                    </th>
                    <th class="number-cell px-1 shrink">Qty</th>
                    <th class="px-0 text-muted shrink">
                        <span class="text-muted">=</span>
                    </th>
                    <th class="number-cell ps-1 shrink">Cost</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="unit in unitsInfo">
                    <td class="expand">
                        <span class="name-prefix"> {{ unit.prefix }}</span>
                        {{ unit.display_name }}
                        <ValidationMessages
                            :messages="unit.validationMessages"
                            :faction-messages="
                                unit.factionValidation?.validationMessages
                            "
                            :faction-id="armyList.faction_id"
                            heading-class="text-danger fw-bold"
                            text-class="text-danger"
                        />
                    </td>

                    <td class="number-cell px-1 shrink">{{ unit.cost }}</td>
                    <td class="px-0 text-muted shrink">&times;</td>
                    <td class="number-cell px-1 shrink">{{ unit.quantity }}</td>
                    <td class="px-0 text-muted shrink">=</td>
                    <td class="number-cell fw-bold ps-1 shrink">
                        {{ unit.quantity * unit.cost }}
                    </td>
                </tr>
            </tbody>
            <caption>
                <div class="px-2 pb-0 text-end">
                    <strong>Total Cost: </strong>
                    {{ totalCost }}
                </div>
            </caption>
        </table>
    </div>
</template>
<style lang="scss">
body .print-unit-list {
    --bs-border-color: rgba(0, 0, 0, 0.33);
    --bs-body-font-size: 0.5rem;

    font-size: 0.6rem;
    table {
        width: 100%;
    }

    th.expand,
    td.expand {
        width: 100%;
    }

    th.shrink,
    td.shrink {
        width: 1%;
        white-space: nowrap;
    }

    .name-prefix {
        opacity: 0.66;
    }
}
</style>
