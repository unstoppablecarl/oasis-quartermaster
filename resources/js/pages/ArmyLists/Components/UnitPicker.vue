<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { PhEye, PhEyeSlash, PhFunnel, PhFunnelX } from '@phosphor-icons/vue'
import { BTable, type BTableSortBy, type TableFieldRaw, vBTooltip } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { type FactionId, FACTIONS } from '../../../../data/factions'
import { type Unit, UNITS } from '../../../../data/units'
import UnitCardModal from '../../../components/army-lists/UnitCardModal.vue'
import HazardTitle from '../../../components/ui/HazardTitle.vue'
import ButtonToggle from './ButtonToggle.vue'

const { factionId } = defineProps<{
    factionId: FactionId
}>()

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
    ...(showClass.value ? [{
        key: 'class',
        sortable: true,
    }] : []),
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
        label: 'HP',
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
const showClass = ref(true)
const includeOutOfBudgetUnits = ref(true)
const includeFactionInvalidUnits = ref(false)
</script>
<template>
    <div class="card mb-3">
        <div class="card-body pt-0">
            <div class="unit-picker-toolbar sticky-top">
                <HazardTitle variant="teal">
                    Recruits
                </HazardTitle>

                <div class="d-flex gap-2 my-2">
                    <div class="btn-py fw-bold">
                        Columns:
                    </div>
                    <ButtonToggle v-model="showPrefix" class-on="success" class-off="info">
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Prefix
                    </ButtonToggle>
                    <ButtonToggle v-model="showClass" class-on="success" class-off="info">
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Class
                    </ButtonToggle>
                    <ButtonToggle v-model="showManufacturer" class-on="success" class-off="info">
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Manufacturer
                    </ButtonToggle>
                    <div class="btn-py ms-2">
                        Rows:
                    </div>
                    <ButtonToggle
                        v-model="includeOutOfBudgetUnits"
                        class-off="secondary"
                    >
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Exceed Available Points
                    </ButtonToggle>
                    <ButtonToggle
                        v-model="includeFactionInvalidUnits"
                        class-off="secondary"
                        v-if="factionId !== FACTIONS.UNAFFILIATED.id"
                    >
                        <template #icon-on>
                            <PhEye weight="fill" />
                        </template>
                        <template #icon-off>
                            <PhEyeSlash weight="fill" />
                        </template>
                        Faction Invalid
                    </ButtonToggle>
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
                no-border-collapse
            >
                <template #cell(display_name)="data">
                    <span class="text-muted fw-light" v-if="showPrefix">{{ data.item.prefix }}</span>
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
    padding-top: var(--bs-card-spacer-y);
}

/* Sticks the table header just below the toolbar above it, instead of at the very top of the viewport. */
:deep(.unit-picker-sticky-head th) {
    position: sticky;
    top: 5.125rem;
    z-index: 2;
}
</style>
