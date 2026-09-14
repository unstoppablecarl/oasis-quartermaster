<script setup lang="ts">
import { Head, useHttp } from '@inertiajs/vue3'
import { computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import InputError from '../../components/InputError.vue'
import { type UnitEntry, useArmyListUnits } from '../../composables/useArmyListUnits'
import { ARMY_LIST_TYPES, ARMY_LIST_TYPES_BY_ID } from '../../data/army-list-types'
import { UNITS } from '../../data/units'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListTable from './ArmyListTable.vue'

const { armyList } = defineProps<{
    armyList: ArmyList;
}>()

type UpdateResponse = {
    armyList: ArmyList
    message: string
}

const http = useHttp<{ display_name: string; units: UnitEntry[]; army_list_type_id: number | null; custom_max_points: number | null }, UpdateResponse>({
    display_name: armyList.display_name,
    units: [] as UnitEntry[],
    army_list_type_id: armyList.army_list_type_id,
    custom_max_points: armyList.custom_max_points,
})

const { units, unitsInfo, add, subtract, remove, totalCost } = useArmyListUnits(armyList)

const allArmyListTypes = Object.values(ARMY_LIST_TYPES)
const isCustomArmyListType = computed(() => http.army_list_type_id === null)
const maxPoints = computed(() => {
    if (http.army_list_type_id === null) {
        return http.custom_max_points
    }

    return ARMY_LIST_TYPES_BY_ID[http.army_list_type_id]?.max_points
})

watch(isCustomArmyListType, (isCustom) => {
    if (!isCustom) {
        http.custom_max_points = null
    }
})

function update() {
    http.units = units.value.map(u => ({ ...u }))

    http.put(ArmyListController.update.url(armyList), {
        onSuccess: (response) => {
            armyList.display_name = response.armyList.display_name
            armyList.army_list_type_id = response.armyList.army_list_type_id
            armyList.custom_max_points = response.armyList.custom_max_points
            units.value = response.armyList.units.map(u => ({ ...u }))
            toast.success(response.message)
        },
        onError: () => {
            toast.error('Failed to update army list')
        },
    })
}

const allUnits = Object.values(UNITS)
</script>
<template>
    <ArmyListItemLayout :army-list="armyList">

        <Head title="Edit" />

        <div class="mb-3">
            <label for="display_name" class="form-label title-font">Name</label>
            <input
                id="display_name"
                type="text"
                class="form-control"
                name="display_name"
                required
                placeholder="Name"
                v-model="http.display_name"
            />
            <InputError class="mt-2" :message="http.errors.display_name" />
        </div>

        <div class="mb-3">
            <label for="army_list_type_id" class="form-label title-font">Type</label>
            <select
                id="army_list_type_id"
                class="form-select"
                name="army_list_type_id"
                v-model="http.army_list_type_id"
            >
                <option v-for="armyListType in allArmyListTypes" :key="armyListType.id" :value="armyListType.id">
                    {{ armyListType.display_name }}
                </option>
                <option :value="null">Custom</option>
            </select>
            <InputError class="mt-2" :message="http.errors.army_list_type_id" />
        </div>

        <div class="mb-3" v-if="isCustomArmyListType">
            <label for="custom_max_points" class="form-label title-font">Custom Max Points</label>
            <input
                id="custom_max_points"
                type="number"
                min="1"
                class="form-control"
                name="custom_max_points"
                required
                v-model.number="http.custom_max_points"
            />
            <InputError class="mt-2" :message="http.errors.custom_max_points" />
        </div>


        <ArmyListTable :army-list="armyList" :show-controls="true" />

        <table class="table w-auto">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th></th>
            </tr>
            </thead>
            <tbody>

            <tr v-for="unit in allUnits" :key="unit.id">
                <td>{{ unit.id }}</td>
                <td>{{ unit.display_name }}</td>
                <td>
                    <button type="button" class="btn btn-primary" @click="add(unit.id, 1)">Add</button>
                </td>
            </tr>
            </tbody>
        </table>
    </ArmyListItemLayout>

    <Teleport to="#page-footer">
        <div class="fixed-bottom bg-dark border-top">
            <div class="container py-1">
                <div class="d-flex">
                    <div class="me-auto"></div>
                    <div class="btn-py px-3">
                        Total Points: {{ totalCost }}<template v-if="maxPoints !== null && maxPoints !== undefined"> / {{ maxPoints }}</template>
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary"
                        :disabled="http.processing"
                        @click="update"
                    >
                        Save
                    </button>
                </div>


            </div>
        </div>
    </Teleport>
</template>
