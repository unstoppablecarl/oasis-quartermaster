<script setup lang="ts">
import { computed } from 'vue'
import UnitCard from '../../../components/ui/UnitCard.vue'
import { useArmyList } from '../../../composables/useArmyList'
import { chunk } from '../../../lib/utils'
import type { ArmyList } from '../../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { unitCards } = useArmyList(armyList)

const pages = computed(() => {
    return chunk(unitCards.value, 4)
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
                <UnitCard
                    v-if="card.cardImage"
                    :unit-card="card"
                    class="game-card-image"
                />
                <div v-else class="game-card-image-not-found-outline">
                    {{ card.display_name }} {{ card.type }}

                    <div class="text-danger">Image Not Found</div>
                </div>
                <div class="game-card-bleed-outline-top"></div>
                <div class="game-card-bleed-outline-right"></div>
                <div class="game-card-bleed-outline-left"></div>
                <div class="game-card-bleed-outline-bottom"></div>
            </div>
        </div>
    </div>
</template>
