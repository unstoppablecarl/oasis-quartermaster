<script setup lang="ts">
import { Head, useHttp } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import InputError from '../../components/InputError.vue'
import { type UnitEntry, useArmyListUnits } from '../../composables/useArmyListUnits'
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

const http = useHttp<{ display_name: string; units: UnitEntry[] }, UpdateResponse>({
    display_name: armyList.display_name,
    units: [] as UnitEntry[],
})

const { units, unitsInfo, add, subtract, remove, totalCost } = useArmyListUnits(armyList)

function update() {
    http.units = units.value.map(u => ({ ...u }))

    http.put(ArmyListController.update.url(armyList), {
        onSuccess: (response) => {
            armyList.display_name = response.armyList.display_name
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
                        Total Points: {{ totalCost }}
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
