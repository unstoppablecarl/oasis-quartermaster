<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import Heading from '../../components/Heading.vue'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList;
}>()
</script>
<template>
    <ArmyListItemLayout :army-list="armyList">
        <Head title="View" />

        <div class="d-flex flex-column gap-4">
            <Heading variant="small" :title="armyList.display_name" />

        </div>
    </ArmyListItemLayout>
</template>
