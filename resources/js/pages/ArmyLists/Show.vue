<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListTable from './ArmyListTable.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
</script>
<template>
    <ArmyListItemLayout :army-list="armyList">
        <Head title="View" />

        <ArmyListTable :units="armyList.units" :show-controls="false" />
    </ArmyListItemLayout>
</template>
