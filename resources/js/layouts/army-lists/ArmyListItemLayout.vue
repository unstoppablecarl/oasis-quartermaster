<script setup lang="ts">
import ArmyListControls from '../../pages/ArmyLists/Components/ArmyListControls.vue'
import ArmyListItemHeader from '../../pages/ArmyLists/Components/ArmyListItemHeader.vue'
import type { ArmyList } from '../../types/army-list'

const { armyList, title } = defineProps<{
    armyList: ArmyList
    title: string
}>()
</script>
<template>
    <div>
        <ArmyListItemHeader :title="title" :description="armyList.display_name">
            <ArmyListControls :army-list="armyList" />
        </ArmyListItemHeader>

        <slot />
    </div>
</template>
