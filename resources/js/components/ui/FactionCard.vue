<script setup lang="ts">

import { computed } from 'vue'
import type { CardType } from '../../composables/useArmyList'
import {
    CARD_DEFAULT_WIDTH,
    factionCardBlackWhite,
    factionCardColor,
    unitCardBlackWhite,
    unitCardColor,
} from '../../lib/static-data-helpers'

const { cardImage, displayName, color = true, width = CARD_DEFAULT_WIDTH } = defineProps<{
    cardImage: string
    color?: boolean
    displayName: string
    width?: number | string
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
    <img
        v-if="src"
        :src="src"
        :alt="`${displayName} Faction Card`"
        :width="width"
    />
    <div v-else class="game-card-image-not-found-outline">
        {{ displayName }} Faction
        <div class="text-danger">Card Image Not Found</div>
    </div>
</template>
