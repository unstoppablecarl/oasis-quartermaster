<script setup lang="ts">
import CommandCard from '../../../components/ui/CommandCard.vue'
import FactionCard from '../../../components/ui/FactionCard.vue'
import UnitCard from '../../../components/ui/UnitCard.vue'
import { useArmyList } from '../../../composables/useArmyList'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'

const { armyList } = defineProps<{
    armyList: LocalArmyList
}>()

const { unitCards, commandCards, factionCards } = useArmyList(armyList)
</script>
<template>
    <h4 class="title text-primary">Faction Cards</h4>
    <div class="row">
        <div
            v-for="faction in factionCards.filter((c) => c.side === 'Front')"
            class="col-3"
        >
            <FactionCard
                :display-name="faction.display_name"
                :side="faction.side"
                :card-image="faction.cardImage"
                class="w-100"
            />
        </div>
    </div>

    <h4 class="title text-primary">Command Cards</h4>
    <div class="row">
        <div
            v-for="faction in commandCards.filter((c) => c.side === 'Front')"
            class="col-3"
        >
            <CommandCard
                :display-name="faction.display_name"
                :side="faction.side"
                :card-image="faction.cardImage"
                class="w-100"
            />
        </div>
        <div v-if="!commandCards.length" class="text-danger-emphasis">
            No Command Cards Selected
        </div>
    </div>

    <h4 class="title text-primary">Unit Cards</h4>
    <div class="row">
        <div v-for="unit in unitCards" class="col-3">
            <UnitCard
                :display-name="unit.display_name"
                :side="unit.side"
                :card-image="unit.cardImage"
                class="w-100"
            />
        </div>
    </div>
</template>
