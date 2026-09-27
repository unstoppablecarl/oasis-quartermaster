<script setup lang="ts">
import FactionCardViewModal from '../../components/army-lists/FactionCardViewModal.vue'
import Fraction from '../../components/Fraction.vue'
import { useArmyList } from '../../composables/useArmyList'
import type { LocalArmyList } from '../../composables/useUnitsInfo'

const { armyList } = defineProps<{
    armyList: LocalArmyList
}>()

const { unitCount, totalCost, maxPoints, faction, commands, armyListTypeName } =
    useArmyList(armyList)
</script>
<template>
    <div class="card mb-3">
        <div class="card-body">
            <div class="d-flex">
                <div class="me-3 me-auto">
                    <span class="ws-nowrap">
                        <strong class="text-body-emphasis">Game Mode: </strong>
                        {{ armyListTypeName }}
                    </span>
                    <span class="ms-4 ws-nowrap">
                        <strong class="text-body-emphasis">Faction: </strong>
                        {{ faction.display_name }}
                    </span>

                    <span class="ms-4 ws-nowrap">
                        <strong class="text-body-emphasis">Commands: </strong>
                        {{ commands.map((c) => c.display_name).join(', ') }}
                        <span
                            v-if="!commands.length"
                            class="text-danger-emphasis"
                        >
                            None Selected
                        </span>
                    </span>

                    <span class="ms-4 ws-nowrap">
                        <strong class="text-body-emphasis">Faction: </strong>
                        <span class="text-teal"
                            >{{ faction.display_name }}
                            <FactionCardViewModal
                                :faction-id="armyList.faction_id"
                            />
                        </span>
                    </span>

                    <span class="mx-3 ws-nowrap">
                        <strong class="text-body-emphasis"> Unit Count: </strong>
                        {{ unitCount }}
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
