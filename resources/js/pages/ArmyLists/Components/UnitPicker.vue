<script setup lang="ts">
import { UNITS } from '../../../../data/units'

const emit = defineEmits<{
    add: [unitId: number]
}>()

const allUnits = Object.values(UNITS)
</script>
<template>
    <table class="table w-auto">
        <thead>
            <tr>
                <th>Name</th>
                <th>Init.</th>
                <th>Dodge</th>
                <th>Defense</th>
                <th>HP</th>
                <th>Speed</th>
                <th>Traits</th>
                <th>Abilities</th>
                <th>Cost</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="unit in allUnits" :key="unit.id">
                <td>{{ unit.display_name }}</td>
                <td>{{ unit.init }}</td>
                <td>{{ unit.dodge }}</td>
                <td>{{ unit.defense }}</td>
                <td>{{ unit.hp }}</td>
                <td>{{ unit.speed }}</td>
                <td>{{ unit.traits.join(', ') }}</td>
                <td>{{ unit.abilities.join(', ') }}</td>
                <td>{{ unit.cost }}</td>
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
