<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { useArmyList } from '../../composables/useArmyList'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListTable from './Components/ArmyListTable.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
const { maxPoints } = useArmyList(armyList)
</script>
<template>
    <ArmyListItemLayout :army-list="armyList">
        <Head title="View" />

        <ArmyListTable
            :units="armyList.units"
            :max-points="maxPoints"
            :show-controls="false"
        />
    </ArmyListItemLayout>
</template>
