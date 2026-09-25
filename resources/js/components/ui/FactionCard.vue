<script setup lang="ts">

import { computed } from 'vue'
import type { CardSide } from '../../composables/useArmyList'
import { CARD_DEFAULT_WIDTH, factionCardBlackWhite, factionCardColor } from '../../lib/static-data-helpers'
import Card from './Card.vue'

const { cardImage, displayName, color = true, side, width = CARD_DEFAULT_WIDTH } = defineProps<{
    cardImage: string
    color?: boolean
    displayName: string
    width?: number | string
    side: CardSide
}>()

const src = computed(() => {
    if (!cardImage) return ''

    if (color) {
        return factionCardColor(cardImage)
    }
    return factionCardBlackWhite(cardImage)
})
</script>
<template>
    <Card
        type="Faction"
        :src="src"
        :display-name="displayName"
        :side="side"
        :width="width"
    />
</template>
