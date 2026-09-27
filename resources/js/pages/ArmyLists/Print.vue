<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListInfoSummary from './ArmyListInfoSummary.vue'
import ArmyListPrintPreview from './Components/ArmyListPrintPreview.vue'
import ArmyListValidationSummary from './Components/ArmyListValidationSummary.vue'

const { armyList, printMode } = defineProps<{
    armyList: ArmyList
    printMode: string
}>()
</script>
<template>
    <ArmyListItemLayout title="Print" :army-list="armyList">
        <Head title="Print" />

        <ArmyListInfoSummary :army-list="armyList" />
        <ArmyListValidationSummary :army-list="armyList" />

        <ArmyListPrintPreview :army-list="armyList" :print-mode="printMode" />
    </ArmyListItemLayout>
</template>
