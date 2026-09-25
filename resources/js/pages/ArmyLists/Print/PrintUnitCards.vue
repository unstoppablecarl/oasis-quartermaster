<script setup lang="ts">
import { computed } from 'vue'
import UnitCard from '../../../components/ui/UnitCard.vue'
import { useArmyList } from '../../../composables/useArmyList'
import { chunk } from '../../../lib/utils'
import type { ArmyList } from '../../../types/army-list'

const { armyList, printCardBacks, printCardsInColor } = defineProps<{
    armyList: ArmyList
    printCardBacks: boolean
    printCardsInColor: boolean
}>()
const { unitCards } = useArmyList(armyList)

const cardsPerPage = 4
const pages = computed(() => {
    if (!printCardBacks) {
        const cards = unitCards.value.filter((c) => c.side === 'Front')
        return chunk(cards, cardsPerPage)
    }

    return chunk(unitCards.value, cardsPerPage)
})
</script>

<template>
    <div
        v-for="(page, index) in pages"
        class="page-preview page-letter"
        style="background-color: white"
    >
        <div class="page-card-grid">
            <div class="page-number">
                Page {{ index + 1 }}/{{ pages.length }}
            </div>
            <div class="game-card" v-for="card in page">
                <UnitCard
                    :display-name="card.display_name"
                    :side="card.side"
                    :card-image="card.cardImage"
                    :color="printCardsInColor"
                    class="game-card-image"
                />

                <div class="game-card-bleed-outline-top"></div>
                <div class="game-card-bleed-outline-right"></div>
                <div class="game-card-bleed-outline-left"></div>
                <div class="game-card-bleed-outline-bottom"></div>
            </div>
        </div>
    </div>
</template>
