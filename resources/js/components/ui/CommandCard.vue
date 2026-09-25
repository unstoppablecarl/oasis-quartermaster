<script setup lang="ts">

import { computed } from 'vue'
import type { CardSide } from '../../composables/useArmyList'
import { CARD_DEFAULT_WIDTH, commandCardBlackWhite, commandCardColor } from '../../lib/static-data-helpers'
import Card from './Card.vue'

const { cardImage, displayName, side, color = true, width = CARD_DEFAULT_WIDTH } = defineProps<{
    cardImage: string
    color?: boolean
    displayName: string
    side: CardSide
    width?: number | string
}>()

const src = computed(() => {
    if (!cardImage) return ''

    if (color) {
        return commandCardColor(cardImage)
    }
    return commandCardBlackWhite(cardImage)
})
</script>
<template>
    <Card
        type="Command"
        :src="src"
        :display-name="displayName"
        :side="side"
        :width="width"
    />
</template>
