<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { BTable, type BTableSortBy, type TableFieldRaw, vBTooltip } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { type Unit, UNITS } from '../../../../data/units'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import ButtonToggle from './ButtonToggle.vue'

const emit = defineEmits<{
    add: [unitId: number]
}>()

const allUnits = Object.values(UNITS)

const fields = computed<Exclude<TableFieldRaw<Unit>, string>[]>(() => ([
    {
        key: 'display_name',
        label: 'Name',
        sortable: true,
        class: 'ws-nowrap',
    },
    {
        key: 'class',
        sortable: true,
    },
    ...(showManufacturer.value ? [{
        key: 'manufacturer',
        sortable: true,
    }] : []),
    {
        key: 'init',
        label: 'Int.',
        sortable: true,
    },
    {
        key: 'dodge',
        sortable: true,
    },
    {
        key: 'defense',
        sortable: true,
    },
    {
        key: 'hp',
        sortable: true,
    },
    {
        key: 'speed',
        label: 'Move',
        sortable: true,
        class: 'ws-nowrap',
    },
    {
        key: 'weapons',
    },
    {
        key: 'traits',
    },
    {
        key: 'abilities',
        class: 'text-teal',
    },
    {
        key: 'cost',
        sortable: true,
    },
    {
        key: 'controls',
        label: '',
        class: 'ws-nowrap',
    },
]))

const sortBy = ref<BTableSortBy[]>([{ key: 'name', order: 'desc' }])
const showPrefix = ref(true)
const showManufacturer = ref(true)

</script>
<template>
    <div class="card mb-3">
        <div class="card-body">
            <div class="unit-picker-toolbar sticky-top">
                <HazardTitle variant="teal">
                    Recruits
                </HazardTitle>

                <div class="d-flex gap-2 my-2">
                    <ButtonToggle v-model="showPrefix">Show Prefix</ButtonToggle>
                    <ButtonToggle v-model="showManufacturer">Show Manufacturer</ButtonToggle>
                </div>
            </div>

            <BTable
                striped
                hover
                thead-class="unit-picker-sticky-head"
                :items="allUnits"
                :fields="fields"
                v-model:sort-by="sortBy"
                head-variant="dark"
            >
                <template #cell(display_name)="data">
                    <span class="opacity-50" v-if="showPrefix">{{ data.item.prefix }}</span>
                    {{ data.item.display_name }}
                </template>

                <template #cell(weapons)="data">
                    {{ data.item.weapons.map((w: any) => w.name).join(', ') }}
                </template>

                <template #cell(traits)="data">
                    {{ data.item.traits.join(', ') }}
                </template>
                <template #cell(abilities)="data">
                    {{ data.item.abilities.join(', ') }}
                </template>
                <template #cell(controls)="data">
                    <button
                        type="button"
                        class="btn btn-sm btn-primary"
                        @click="emit('add', data.item.id)"
                        v-b-tooltip.hover.top
                        title="Add to List"
                    >
                        <Plus :strokeWidth="2.5" :size="16" />
                    </button>

                    <UnitCardModal :unit-id="data.item.id" />
                </template>
            </BTable>
        </div>
    </div>
</template>
<style scoped>
.unit-picker-toolbar {
    background: var(--bs-card-bg);
    z-index: 3;
}

/* Sticks the table header just below the toolbar above it, instead of at the very top of the viewport. */
:deep(.unit-picker-sticky-head th) {
    position: sticky;
    top: 4.125rem;
    z-index: 2;
}
</style>
