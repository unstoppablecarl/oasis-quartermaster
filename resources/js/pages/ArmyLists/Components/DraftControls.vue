<script setup lang="ts">
import { edit, print, show } from '../../../routes/army-lists/draft'
import ArmyListViewPrintEditLinks from './ArmyListViewPrintEditLinks.vue'

const { idPrefix } = defineProps<{
    idPrefix?: string
}>()
</script>
<template>
    <ArmyListViewPrintEditLinks
        :show-href="show()"
        :print-href="print()"
        :edit-href="edit()"
        :id-prefix="idPrefix"
    />
</template>
