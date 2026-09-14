<script setup lang="ts">
import { UNITS } from '../../data/units'

const emit = defineEmits<{
    add: [unitId: number]
}>()

const allUnits = Object.values(UNITS)
</script>
<template>
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
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="emit('add', unit.id)"
                    >
                        Add
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
