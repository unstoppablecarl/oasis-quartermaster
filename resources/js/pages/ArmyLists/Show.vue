<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { useArmyList } from '../../composables/useArmyList'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListUnits from './Components/ArmyListUnits.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { maxPoints, unitCount } = useArmyList(armyList)
</script>
<template>
    <ArmyListItemLayout title="View" :army-list="armyList">
        <Head title="View" />

        <ArmyListUnits
            :units="armyList.units"
            :max-points="maxPoints"
            :show-controls="false"
        />
    </ArmyListItemLayout>
</template>
