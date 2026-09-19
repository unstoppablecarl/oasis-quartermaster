<script setup lang="ts">

import type { UnitCard } from '../../composables/useArmyList'

const { unitCard } = defineProps<{
    unitCard: UnitCard
}>()

</script>
<template>
    <img
        :src="`/images/cards/units/${unitCard.cardImage}`"
        :alt="`${unitCard.display_name} ${unitCard.type} Card`"
    />
</template>
