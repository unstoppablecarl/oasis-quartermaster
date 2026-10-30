<script setup lang="ts">
import FactionCardViewModal from '../../components/army-lists/FactionCardViewModal.vue'
import Fraction from '../../components/Fraction.vue'
import { injectArmyList } from '../../composables/useArmyList'

const {
    armyList,
    unitCount,
    maxUnits,
    totalCost,
    maxPoints,
    faction,
    commands,
    armyListTypeName,
} = injectArmyList()
</script>
<template>
    <div class="card mb-3">
        <div class="card-body">
            <div class="d-flex">
                <div class="d-flex flex-wrap column-gap-4 row-gap-1 me-auto">
                    <span class="ws-nowrap">
                        <strong class="text-body-emphasis">Game Mode: </strong>
                        {{ armyListTypeName }}
                    </span>
                    <span class="ws-nowrap">
                        <strong class="text-body-emphasis">Faction: </strong>
                        {{ faction.display_name }}
                        <FactionCardViewModal
                            v-if="faction.card_front"
                            :faction-id="armyList.faction_id"
                        />
                    </span>

                    <span>
                        <strong class="text-body-emphasis">Commands: </strong>
                        {{ commands.map((c) => c.display_name).join(', ') }}
                        <span
                            v-if="!commands.length"
                            class="text-danger-emphasis"
                        >
                            None Selected
                        </span>
                    </span>

                    <span class="ws-nowrap">
                        <strong class="text-body-emphasis"> Unit Count: </strong>
                        <Fraction :a="unitCount" :b="maxUnits" />
                    </span>

                    <span class="ws-nowrap">
                        <strong class="text-body-emphasis"> Total Points: </strong>
                        <Fraction :a="totalCost" :b="maxPoints" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
