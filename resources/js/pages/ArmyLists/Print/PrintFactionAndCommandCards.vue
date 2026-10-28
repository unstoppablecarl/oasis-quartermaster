<script setup lang="ts">
import { computed } from 'vue'
import { injectArmyList } from '../../../composables/useArmyList'
import { chunk } from '../../../lib/utils'
import PrintCardPages from '../Components/PrintCardPages.vue'

const {
    printCardBacks,
    printCardsInColor,
    printCommandCards,
    printFactionCard,
} = defineProps<{
    printCardBacks: boolean
    printCardsInColor: boolean
    printCommandCards: boolean
    printFactionCard: boolean
}>()
const { commandCards, factionCards } = injectArmyList()

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
        cards = cards.filter((c) => c.side === 'Front')
    }

    return chunk(cards, cardsPerPage)
})
</script>
<template>
    <PrintCardPages :pages="pages" :print-cards-in-color="printCardsInColor" />
</template>
