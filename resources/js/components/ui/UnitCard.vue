<script setup lang="ts">
import { computed } from 'vue'
import type { CardSide } from '../../composables/useArmyList'
import {
    CARD_DEFAULT_WIDTH,
    unitCardBlackWhite,
    unitCardColor,
} from '../../lib/static-data-helpers'
import Card from './Card.vue'

const {
    cardImage,
    displayName,
    side,
    color = true,
    width = CARD_DEFAULT_WIDTH,
} = defineProps<{
    cardImage: string
    color?: boolean
    displayName: string
    side: CardSide
    width?: number | string
}>()

const src = computed(() => {
    if (!cardImage) return ''

    if (color) {
        return unitCardColor(cardImage)
    }
    return unitCardBlackWhite(cardImage)
})
</script>
<template>
    <Card
        type="Unit"
        :src="src"
        :display-name="displayName"
        :side="side"
        :width="width"
    />
</template>
