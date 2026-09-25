<script setup lang="ts">

import { computed } from 'vue'
import type { CardType } from '../../composables/useArmyList'
import { CARD_DEFAULT_WIDTH, commandCardBlackWhite, commandCardColor } from '../../lib/static-data-helpers'

defineOptions({ inheritAttrs: false })

const { cardImage, displayName, type, color = true, width = CARD_DEFAULT_WIDTH } = defineProps<{
    cardImage: string
    color?: boolean
    displayName: string
    type: CardType
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
    <img
        v-bind="$attrs"
        v-if="src"
        :src="src"
        :alt="`${displayName} Command Card`"
        :width="width"
    />
    <div v-else class="game-card-image-not-found-outline">
        {{ displayName }} {{ type }} Command
        <div class="text-danger">Card Image Not Found</div>
    </div>
</template>
