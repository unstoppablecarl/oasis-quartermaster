<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListInfoSummary from './ArmyListInfoSummary.vue'
import ArmyListCardsPreview from './Components/ArmyListCardsPreview.vue'
import ArmyListValidationSummary from './Components/ArmyListValidationSummary.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()
</script>
<template>
    <ArmyListItemLayout title="View" :army-list="armyList">
        <Head title="View" />

        <ArmyListInfoSummary :army-list="armyList" />
        <ArmyListValidationSummary :army-list="armyList" />

        <ArmyListCardsPreview :army-list="armyList" />
    </ArmyListItemLayout>
</template>
