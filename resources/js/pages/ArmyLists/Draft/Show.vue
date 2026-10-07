<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { reactive } from 'vue'
import { provideArmyList } from '../../../composables/useArmyList'
import { loadArmyListDraft } from '../../../lib/armyListDraft'
import ArmyListInfoSummary from '../ArmyListInfoSummary.vue'
import ArmyListCardsPreview from '../Components/ArmyListCardsPreview.vue'
import ArmyListItemHeader from '../Components/ArmyListItemHeader.vue'
import ArmyListValidationSummary from '../Components/ArmyListValidationSummary.vue'
import DraftControls from '../Components/DraftControls.vue'

const armyList = reactive(loadArmyListDraft())

provideArmyList(armyList)
</script>
<template>
    <Head title="View Draft" />

    <ArmyListItemHeader title="View" :description="armyList.display_name">
        <DraftControls />
    </ArmyListItemHeader>

    <ArmyListInfoSummary />
    <ArmyListValidationSummary />

    <ArmyListCardsPreview />
</template>
