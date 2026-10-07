<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { reactive } from 'vue'
import { provideArmyList } from '../../../composables/useArmyList'
import { loadArmyListDraft } from '../../../lib/armyListDraft'
import ArmyListInfoSummary from '../ArmyListInfoSummary.vue'
import ArmyListItemHeader from '../Components/ArmyListItemHeader.vue'
import ArmyListPrintPreview from '../Components/ArmyListPrintPreview.vue'
import ArmyListValidationSummary from '../Components/ArmyListValidationSummary.vue'
import DraftControls from '../Components/DraftControls.vue'

const { printMode } = defineProps<{
    printMode: string
}>()

const armyList = reactive(loadArmyListDraft())

provideArmyList(armyList)
</script>
<template>
    <Head title="Print Draft" />

    <ArmyListItemHeader title="Print" :description="armyList.display_name">
        <DraftControls />
    </ArmyListItemHeader>

    <ArmyListInfoSummary />
    <ArmyListValidationSummary heading-class="text-teal" />

    <ArmyListPrintPreview :print-mode="printMode" />
</template>
