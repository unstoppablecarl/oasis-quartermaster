<script setup lang="ts">
import FactionCardViewModal from '../../components/army-lists/FactionCardViewModal.vue'
import Fraction from '../../components/Fraction.vue'
import { useArmyList } from '../../composables/useArmyList'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

const { unitCount, totalCost, maxPoints, faction } = useArmyList(armyList)

</script>
<template>

    <div class="card mb-3">
        <div class="card-body">
            <div class="d-flex">
                <div class="pe-3 me-auto">
                    <strong class="">Faction: </strong>
                    <span class="text-teal">{{ faction.display_name }}
                        <FactionCardViewModal :faction-id="armyList.faction_id" />
                    </span>
                </div>
                <div class="px-3">
                    <strong> Unit Count: </strong>
                    <span class="text-body-emphasis">
                        {{ unitCount }}
                    </span>
                </div>
                <div class="ps-3">
                    <strong> Total Points: </strong>
                    <Fraction :a="totalCost" :b="maxPoints" />
                </div>
            </div>
        </div>
    </div>
</template>
