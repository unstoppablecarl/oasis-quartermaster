<script setup lang="ts">
import { Head, useHttp } from '@inertiajs/vue3'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import {
    type UnitEntry,
    useArmyListUnits,
} from '../../composables/useArmyListUnits'
import { ARMY_LIST_TYPES_BY_ID } from '../../data/army-list-types'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListFields from './Components/ArmyListFields.vue'
import ArmyListSaveBar from './Components/ArmyListSaveBar.vue'
import ArmyListTable from './Components/ArmyListTable.vue'
import UnitPicker from './Components/UnitPicker.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

type UpdateResponse = {
    armyList: ArmyList
    message: string
}

const http = useHttp<
    {
        display_name: string
        units: UnitEntry[]
        army_list_type_id: number | null
        custom_max_points: number | null
    },
    UpdateResponse
>({
    display_name: armyList.display_name,
    units: [] as UnitEntry[],
    army_list_type_id: armyList.army_list_type_id,
    custom_max_points: armyList.custom_max_points,
})

const { units, add, subtract, remove, totalCost } = useArmyListUnits(
    armyList.units,
)

const maxPoints = computed(() => {
    if (http.army_list_type_id === null) {
        return http.custom_max_points
    }

    return ARMY_LIST_TYPES_BY_ID[http.army_list_type_id]?.max_points
})

function update() {
    http.units = units.value.map((u) => ({ ...u }))

    http.put(ArmyListController.update.url(armyList), {
        onSuccess: (response) => {
            armyList.display_name = response.armyList.display_name
            armyList.army_list_type_id = response.armyList.army_list_type_id
            armyList.custom_max_points = response.armyList.custom_max_points
            units.value = response.armyList.units.map((u) => ({ ...u }))
            toast.success(response.message)
        },
        onError: () => {
            toast.error('Failed to update army list')
        },
    })
}
</script>
<template>
    <ArmyListItemLayout :army-list="armyList">
        <Head title="Edit" />

        <ArmyListFields
            v-model:display-name="http.display_name"
            v-model:army-list-type-id="http.army_list_type_id"
            v-model:custom-max-points="http.custom_max_points"
            :errors="http.errors"
        />

        <ArmyListTable
            :units="units"
            :show-controls="true"
            @add="add"
            @subtract="subtract"
            @remove="remove"
        />

        <UnitPicker @add="add" />
    </ArmyListItemLayout>

    <ArmyListSaveBar
        :total-cost="totalCost"
        :max-points="maxPoints"
        :processing="http.processing"
        @save="update"
    />
</template>
