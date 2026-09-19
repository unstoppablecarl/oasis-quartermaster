<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import UnitCard from '../../components/ui/UnitCard.vue'
import { useArmyList } from '../../composables/useArmyList'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { unitCards } = useArmyList(armyList)
</script>
<template>
    <ArmyListItemLayout title="View" :army-list="armyList">
        <Head title="View" />

        <div class="row">
            <div v-for="unit in unitCards" class="col-3">
                <div>{{ unit.display_name }} {{ unit.type }}</div>
                <div>
                    <UnitCard
                        v-if="unit.cardImage"
                        :unit-card="unit"
                        class="w-100"
                    />
                    <div v-else>
                        Image Not Found
                    </div>
                </div>
            </div>
        </div>
    </ArmyListItemLayout>
</template>
