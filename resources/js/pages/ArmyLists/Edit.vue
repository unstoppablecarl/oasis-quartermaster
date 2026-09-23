<script setup lang="ts">
import { Head, setLayoutProps, useHttp } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import type { FactionId } from '../../../data/factions'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import { useArmyList } from '../../composables/useArmyList'
import type { LocalArmyList } from '../../composables/useUnitsInfo'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListFactionValidators from './Components/ArmyListFactionValidation.vue'
import ArmyListFields from './Components/ArmyListFields.vue'
import ArmyListSaveBar from './Components/ArmyListSaveBar.vue'
import ArmyListUnits from './Components/ArmyListUnits.vue'
import UnitPicker from './Components/UnitPicker.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

setLayoutProps({
    saveBarPadding: true,
})

type UpdateResponse = {
    armyList: ArmyList
    message: string
    public: boolean
    faction_id: FactionId
}

const http = useHttp<LocalArmyList & { uuid?: string }, UpdateResponse>({
    uuid: armyList.uuid,
    display_name: armyList.display_name,
    units: armyList.units.map((u) => ({ ...u })),
    army_list_type_id: armyList.army_list_type_id,
    custom_max_points: armyList.custom_max_points,
    public: armyList.public,
    faction_id: armyList.faction_id,
    commands: armyList.commands,
})

const { add, subtract, remove, reorder, totalCost, unitCount, maxPoints } = useArmyList(http)

function update() {
    http.put(ArmyListController.update.url(armyList), {
        onBefore: () => {
            armyList.units = armyList.units.filter(u => u.quantity > 0)
        },
        onSuccess: (response) => {
            armyList.display_name = response.armyList.display_name
            armyList.army_list_type_id = response.armyList.army_list_type_id
            armyList.custom_max_points = response.armyList.custom_max_points
            armyList.units = response.armyList.units.map((u) => ({ ...u }))
            armyList.public = response.public
            armyList.faction_id = response.faction_id
            toast.success(response.message)
        },
        onError: () => {
            toast.error('Failed to update army list')
        },
    })
}
</script>
<template>
    <ArmyListItemLayout title="Edit" :army-list="armyList">
        <Head title="Edit" />

        <ArmyListFields :army-list="http" :errors="http.errors" />
        <ArmyListFactionValidators :army-list="armyList" />
    </ArmyListItemLayout>

    <Teleport to="#before-page-footer-teleport" defer>
        <div class="container-fluid">
            <ArmyListUnits
                :units="http.units"
                :show-controls="true"
                :max-points="maxPoints"
                @add="add"
                @subtract="subtract"
                @remove="remove"
                @reorder="reorder"
            />

            <UnitPicker @add="add" :army-list="http" />

        </div>
    </Teleport>
    <ArmyListSaveBar
        :name="armyList.display_name"
        :total-cost="totalCost"
        :max-points="maxPoints"
        :processing="http.processing"
        :unit-count="unitCount"
        @save="update"
    />
</template>
