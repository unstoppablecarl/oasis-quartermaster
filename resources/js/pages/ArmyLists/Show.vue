<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import CommandCard from '../../components/ui/CommandCard.vue'
import FactionCard from '../../components/ui/FactionCard.vue'
import UnitCard from '../../components/ui/UnitCard.vue'
import { useArmyList } from '../../composables/useArmyList'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListInfoSummary from './ArmyListInfoSummary.vue'
import ArmyListValidationSummary from './Components/ArmyListValidationSummary.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { unitCards, commandCards, factionCards } = useArmyList(armyList)
</script>
<template>
    <ArmyListItemLayout title="View" :army-list="armyList">
        <Head title="View" />

        <ArmyListInfoSummary :army-list="armyList" />
        <ArmyListValidationSummary :army-list="armyList" />

        <h4 class="title text-primary">Faction Cards</h4>
        <div class="row">
            <div
                v-for="faction in factionCards.filter(
                    (c) => c.side === 'Front',
                )"
                class="col-3"
            >
                <FactionCard
                    :display-name="faction.display_name"
                    :side="faction.side"
                    :card-image="faction.cardImage"
                    class="w-100"
                />
            </div>
        </div>

        <h4 class="title text-primary">Command Cards</h4>
        <div class="row">
            <div
                v-for="faction in commandCards.filter(
                    (c) => c.side === 'Front',
                )"
                class="col-3"
            >
                <CommandCard
                    :display-name="faction.display_name"
                    :side="faction.side"
                    :card-image="faction.cardImage"
                    class="w-100"
                />
            </div>
            <div v-if="!commandCards.length" class="text-danger-emphasis">
                No Command Cards Selected
            </div>
        </div>

        <h4 class="title text-primary">Unit Cards</h4>
        <div class="row">
            <div v-for="unit in unitCards" class="col-3">
                <UnitCard
                    :display-name="unit.display_name"
                    :side="unit.side"
                    :card-image="unit.cardImage"
                    class="w-100"
                />
            </div>
        </div>
    </ArmyListItemLayout>
</template>
