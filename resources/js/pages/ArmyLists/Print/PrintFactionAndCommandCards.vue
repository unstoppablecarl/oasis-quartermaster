<script setup lang="ts">
import { computed } from 'vue'
import CommandCard from '../../../components/ui/CommandCard.vue'
import FactionCard from '../../../components/ui/FactionCard.vue'
import { useArmyList } from '../../../composables/useArmyList'
import { chunk } from '../../../lib/utils'
import type { ArmyList } from '../../../types/army-list'

const { armyList, printCardBacks, printCardsInColor, printCommandCards, printFactionCard } = defineProps<{
    armyList: ArmyList,
    printCardBacks: boolean
    printCardsInColor: boolean
    printCommandCards: boolean
    printFactionCard: boolean
}>()
const { commandCards, factionCards } = useArmyList(armyList)

const cardsPerPage = 4
const pages = computed(() => {
    let cards = []
    if (printFactionCard) {
        cards.push(...factionCards.value)
    }
    if (printCommandCards) {
        cards.push(...commandCards.value)
    }
    if (!printCardBacks) {
        cards = cards.filter(c => c.side === 'Front')
    }

    return chunk(cards, cardsPerPage)
})
</script>
<template>
    <div
        v-for="(page, index) in pages"
        class="page-preview page-letter"
        style="background-color:white"
    >
        <div class="page-card-grid">
            <div class="page-number">Page {{ index + 1 }}/{{ pages.length }}</div>
            <div class="game-card" v-for="card in page">
                <FactionCard
                    v-if="card.type === 'Faction'"
                    :display-name="card.display_name"
                    :side="card.side"
                    :card-image="card.cardImage"
                    :color="printCardsInColor"
                    class="game-card-image"
                />
                <CommandCard
                    v-if="card.type === 'Command'"
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
