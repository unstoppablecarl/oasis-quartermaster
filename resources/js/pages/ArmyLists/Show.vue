<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import Fraction from '../../components/Fraction.vue'
import UnitCard from '../../components/ui/UnitCard.vue'
import { useArmyList } from '../../composables/useArmyList'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListValidationSummary from './Components/ArmyListValidationSummary.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { unitCards, totalCost, maxPoints, unitCount, faction, commands, armyListTypeName } = useArmyList(armyList)
</script>
<template>
    <ArmyListItemLayout title="View" :army-list="armyList">
        <Head title="View" />

        <div class="card mb-2">
            <div class="card-body">
                <div class="d-flex">
                    <div class="me-auto">
                        <span>
                            <strong class="text-body-emphasis">Game Mode: </strong>
                            {{ armyListTypeName }}
                        </span>
                        <span class="ms-4">
                            <strong class="text-body-emphasis">Faction: </strong> {{ faction.display_name }}
                        </span>

                        <span class="ms-4">
                            <strong class="text-body-emphasis">Commands: </strong>
                            {{ commands.map(c => c.display_name).join(', ') }}
                        </span>
                    </div>
                    <div>
                        <strong>Unit Count: </strong>
                        <span class="text-body-emphasis me-3">{{ unitCount }}</span>
                        <strong>Total Cost: </strong>
                        <Fraction :a="totalCost" :b="maxPoints" />
                    </div>
                </div>
            </div>
        </div>

        <ArmyListValidationSummary :army-list="armyList" />

        <div class="row">
            <div v-for="unit in unitCards" class="col-3">
                <div>{{ unit.display_name }} {{ unit.type }}</div>
                <div>
                    <UnitCard
                        :display-name="unit.display_name"
                        :type="unit.type"
                        :card-image="unit.cardImage"
                        class="w-100"
                    />
                </div>
            </div>
        </div>
    </ArmyListItemLayout>
</template>
