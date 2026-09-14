<script setup lang="ts">
import { Head, useHttp } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import InputError from '../../components/InputError.vue'
import { UNITS, UNITS_BY_ID } from '../../data/units'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList;
}>()

type UnitEntry = {
    id: number
    quantity: number
}

const units = ref<UnitEntry[]>(armyList.units.map(u => ({ ...u })))

const http = useHttp({
    display_name: armyList.display_name,
    units: [] as UnitEntry[],
})

function update() {
    http.units = units.value.map(u => ({ ...u }))

    http.put(ArmyListController.update.url(armyList), {
        onSuccess: (response: any) => {
            toast.success(response.message)
        },
        onError: () => {
            toast.error('Failed to update army list')
        },
    })
}

const allUnits = Object.values(UNITS)

function add(unitId: number, quantity = 1) {
    const existing = units.value.find(v => v.id === unitId)
    if (existing) {
        existing.quantity += quantity
        return
    }

    units.value.push({
        id: unitId,
        quantity,
    })
}

function subtract(unitId: number, quantity = 1) {
    const existing = units.value.find(v => v.id === unitId)
    if (!existing) {
        return
    }

    if (existing.quantity <= quantity) {
        remove(unitId)
        return
    }

    existing.quantity -= quantity
}

function remove(unitId: number) {
    units.value = units.value.filter(v => v.id !== unitId)
}

const unitsInfo = computed(() => {
    return units.value.map(u => {
        return {
            ...u,
            ...UNITS_BY_ID[u.id],
        }
    })
})

</script>
<template>
    <ArmyListItemLayout :army-list="armyList">

        <Head title="Edit" />

        <form @submit.prevent="update">
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

            <p class="title-font">Units</p>
            <table class="table w-auto">
                <thead>
                <tr>
<!--                    <th>ID</th>-->
                    <th>Name</th>
                    <th class="number-cell">Qty</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="unit in unitsInfo" :key="unit.id">
<!--                    <td>{{ unit.id }}</td>-->
                    <td>{{ unit.display_name }}</td>
                    <td class="number-cell">{{ unit.quantity }}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button type="button" role="button" class="btn btn-outline-primary"
                                    @click="subtract(unit.id, 1)">-
                            </button>
                            <button type="button" role="button" class="btn btn-outline-primary" @click="add(unit.id, 1)">+
                            </button>
                        </div>
                        <button type="button" role="button" class="btn btn-danger btn-sm ms-1" @click="remove(unit.id)">X</button>
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="d-flex align-items-center gap-3">
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="http.processing"
                >
                    Save
                </button>
            </div>
        </form>

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
</template>
