<script setup lang="ts">
import FactionCardViewModal from '../../components/army-lists/FactionCardViewModal.vue'
import Fraction from '../../components/Fraction.vue'
import { useArmyList } from '../../composables/useArmyList'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

const { unitCount, totalCost, maxPoints, faction, commands, armyListTypeName } = useArmyList(armyList)

</script>
<template>

    <div class="card mb-3">
        <div class="card-body">
            <div class="d-flex">
                <div class="me-3 me-auto">

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

                    <span class="ms-4">
                        <strong class="text-body-emphasis">Faction: </strong>
                        <span class="text-teal">{{ faction.display_name }}
                            <FactionCardViewModal :faction-id="armyList.faction_id" />
                        </span>
                    </span>
                </div>

                <div class="mx-3">
                    <strong class="text-body-emphasis"> Unit Count: </strong>

                    {{ unitCount }}

                </div>
                <div class="ms-3">
                    <strong class="text-body-emphasis"> Total Points: </strong>
                    <Fraction :a="totalCost" :b="maxPoints" />
                </div>
            </div>
        </div>
    </div>
</template>
