<script setup lang="ts">
import { PhPlus } from '@phosphor-icons/vue'
import { vBTooltip } from 'bootstrap-vue-next'
import { UNITS } from '../../../../data/units'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'

const emit = defineEmits<{
    add: [unitId: number]
}>()

const allUnits = Object.values(UNITS)
</script>
<template>
    <div class="card mb-3">
        <div class="card-body">
            <div class="title pb-2 ms-2">Recruits</div>
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
                    <td class="ws-nowrap">


                        <button
                            type="button"
                            class="btn btn-sm btn-primary"
                            @click="emit('add', unit.id)"
                            v-b-tooltip.hover.top
                            title="Add to List"
                        >
                            <PhPlus :size="16" />
                        </button>


                        <UnitCardModal :unit-id="unit.id" />
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
