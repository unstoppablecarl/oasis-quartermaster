<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { computed } from 'vue'
import { useArmyList } from '../../composables/useArmyList'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { unitsInfo } = useArmyList(armyList)

const cards = computed(() => {
    const output = []
    for (const unit of unitsInfo.value) {
        for (const front of unit.cards_front) {
            output.push({
                display_name: unit.display_name,
                type: 'Front',
                card: front,
            })
        }
        if(!unit.cards_front.length){
            output.push({
                display_name: unit.display_name,
                type: 'Front',
                card: '',
            })
        }
        output.push({
            display_name: unit.display_name,
            type: 'Back',
            card: unit.card_back,
        })
    }

    return output
})
</script>
<template>
    <ArmyListItemLayout title="View" :army-list="armyList">
        <Head title="View" />

        <div class="row">
            <div v-for="unit in cards" class="col-3">
                <div>{{ unit.display_name }} {{ unit.type }}</div>
                <div>
                    <img
                        v-if="unit.card"
                        :src="`/images/cards/units/${unit.card}`"
                        :alt="`${unit.display_name} ${unit.type} Card`"
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
