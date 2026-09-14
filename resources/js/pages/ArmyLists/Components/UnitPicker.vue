<script setup lang="ts">
import { UNITS } from '../../../../data/units'

const emit = defineEmits<{
    add: [unitId: number]
}>()

const allUnits = Object.values(UNITS)
</script>
<template>
    <div class="title pb-2">Recruits</div>
    <div class="card mb-3">
        <div class="card-body">
            <table class="table">
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
                    <td class="text-teal">{{ unit.traits.join(', ') }}</td>
                    <td>{{ unit.abilities.join(', ') }}</td>
                    <td>{{ unit.cost }}</td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-sm btn-secondary"
                        >
                            View&nbsp;Card
                        </button>
                    </td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-sm btn-primary"
                            @click="emit('add', unit.id)"
                        >
                            Add
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
