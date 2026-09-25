<script setup lang="ts">

import type { CardSide } from '../../composables/useArmyList'
import { CARD_DEFAULT_WIDTH } from '../../lib/static-data-helpers'

defineOptions({ inheritAttrs: false })

const { type, src, displayName, side, width = CARD_DEFAULT_WIDTH } = defineProps<{
    type: string,
    src: string
    displayName: string
    side: CardSide
    width?: number | string
}>()

</script>
<template>
    <img
        v-bind="$attrs"
        v-if="src"
        :src="src"
        :alt="`${displayName} ${side} ${type} Card`"
        :width="width"
    />
    <div v-else class="game-card-image-not-found-outline" v-bind="$attrs">
        {{ displayName }} {{ type }} {{ side }}
        <div class="text-danger">Card Image Not Found</div>
    </div>
</template>
