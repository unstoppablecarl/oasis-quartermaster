<script setup lang="ts">
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import { BButton } from 'bootstrap-vue-next'
import { computed } from 'vue'
import CommandCard from '../../../components/ui/CommandCard.vue'
import FactionCard from '../../../components/ui/FactionCard.vue'
import UnitCard from '../../../components/ui/UnitCard.vue'
import { injectArmyList } from '../../../composables/useArmyList'
import { usePersistentSettings } from '../../../composables/usePersistentSettings'
import ButtonToggle from './ButtonToggle.vue'

const { showUnitCardBacks, showCommandCardBacks } = usePersistentSettings()

const { unitCards, commandCards, factionCards } = injectArmyList()

const isMobile = useBreakpoints(breakpointsBootstrapV5).smaller('sm')
const toggleBtnSize = computed(() => isMobile.value ? 'md' : 'sm')

const visibleUnitCards = computed(() =>
    showUnitCardBacks.value
        ? unitCards.value
        : unitCards.value.filter((c) => c.side === 'Front'),
)

const visibleCommandCards = computed(() =>
    showCommandCardBacks.value
        ? commandCards.value
        : commandCards.value.filter((c) => c.side === 'Front'),
)
</script>
<template>
    <div v-if="factionCards.length" class="mb-4">
        <h4 class="title text-primary">Faction Card</h4>
        <div class="row gy-3">
            <div
                v-for="(faction, index) in factionCards.filter((c) => c.side === 'Front')"
                :key="`${faction.display_name}-${index}`"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
                <FactionCard
                    :display-name="faction.display_name"
                    :side="faction.side"
                    :card-image="faction.cardImage"
                    class="w-100"
                />
            </div>
        </div>
    </div>

    <div class="mb-4">
        <div class="d-grid d-sm-flex align-items-sm-center gap-2 column-gap-3 mb-2">
            <h4 class="title text-primary mb-0">Command Cards</h4>
            <ButtonToggle
                v-model="showCommandCardBacks"
                class-on="success"
                class-off="info"
                :size="toggleBtnSize"
            >
                <template #icon-on>
                    <PhEye weight="fill" />
                </template>
                <template #icon-off>
                    <PhEyeSlash weight="fill" />
                </template>
                Show Command Card Backs
            </ButtonToggle>
        </div>
        <div class="row gy-3">
            <div
                v-for="(command, index) in visibleCommandCards"
                :key="`${command.display_name}-${command.side}-${index}`"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
                <CommandCard
                    :display-name="command.display_name"
                    :side="command.side"
                    :card-image="command.cardImage"
                    class="w-100"
                />
            </div>
            <div v-if="!commandCards.length" class="text-danger-emphasis">
                No Command Cards Selected
            </div>
        </div>
    </div>

    <div class="mb-4">
        <div class="d-grid d-sm-flex align-items-sm-center gap-2 column-gap-3 mb-2">
            <h4 class="title text-primary mb-0">Unit Cards</h4>
            <ButtonToggle
                v-model="showUnitCardBacks"
                class-on="success"
                class-off="info"
                :size="toggleBtnSize"
            >
                <template #icon-on>
                    <PhEye weight="fill" />
                </template>
                <template #icon-off>
                    <PhEyeSlash weight="fill" />
                </template>
                Show Unit Card Backs
            </ButtonToggle>
        </div>
        <div class="row gy-3">
            <div
                v-for="(unit, index) in visibleUnitCards"
                :key="`${unit.display_name}-${unit.side}-${index}`"
                class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
                <UnitCard
                    :display-name="unit.display_name"
                    :side="unit.side"
                    :card-image="unit.cardImage"
                    class="w-100"
                />
            </div>
        </div>
    </div>
</template>
