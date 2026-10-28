<script setup lang="ts">
import { computed } from 'vue'
import { injectArmyList } from '../../../composables/useArmyList'
import { chunk } from '../../../lib/utils'
import PrintCardPages from '../Components/PrintCardPages.vue'

const { printCardBacks, printCardsInColor } = defineProps<{
    printCardBacks: boolean
    printCardsInColor: boolean
}>()
const { unitCards } = injectArmyList()

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
    <PrintCardPages :pages="pages" :print-cards-in-color="printCardsInColor" />
</template>
