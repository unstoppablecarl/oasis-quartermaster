<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { computed, watch } from 'vue'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import Heading from '../../components/Heading.vue'
import {
    type UnitEntry,
    useArmyListUnits,
} from '../../composables/useArmyListUnits'
import {
    ARMY_LIST_TYPES,
    ARMY_LIST_TYPES_BY_ID,
} from '../../data/army-list-types'
import {
    clearArmyListDraft,
    loadArmyListDraft,
    saveArmyListDraft,
} from '../../lib/armyListDraft'
import { login, register } from '../../routes'
import ArmyListFields from './Components/ArmyListFields.vue'
import ArmyListSaveBar from './Components/ArmyListSaveBar.vue'
import ArmyListTable from './Components/ArmyListTable.vue'
import UnitPicker from './Components/UnitPicker.vue'

const page = usePage()
const auth = computed(() => page.props.auth)

const allArmyListTypes = Object.values(ARMY_LIST_TYPES)
const draft = loadArmyListDraft()

const form = useForm<{
    display_name: string
    units: UnitEntry[]
    army_list_type_id: number | null
    custom_max_points: number | null
}>({
    display_name: draft ? draft.display_name : '',
    units: [],
    army_list_type_id: draft
        ? draft.army_list_type_id
        : (allArmyListTypes[0]?.id ?? null),
    custom_max_points: draft ? draft.custom_max_points : null,
})

const { units, add, subtract, remove, totalCost } = useArmyListUnits(
    draft?.units ?? [],
)

const maxPoints = computed(() => {
    if (form.army_list_type_id === null) {
        return form.custom_max_points
    }

    return ARMY_LIST_TYPES_BY_ID[form.army_list_type_id]?.max_points
})

watch(
    [
        () => form.display_name,
        () => form.army_list_type_id,
        () => form.custom_max_points,
        units,
    ],
    () => {
        if (auth.value.user) {
            return
        }

        saveArmyListDraft({
            display_name: form.display_name,
            army_list_type_id: form.army_list_type_id,
            custom_max_points: form.custom_max_points,
            units: units.value.map((u) => ({ ...u })),
        })
    },
    { deep: true },
)

function save() {
    if (!auth.value.user) {
        return
    }

    form.units = units.value.map((u) => ({ ...u }))

    form.post(ArmyListController.store.url(), {
        onSuccess: () => {
            clearArmyListDraft()
        },
    })
}
</script>
<template>
    <Head title="Create" />

    <Heading variant="small" title="Create" />

    <ArmyListFields
        v-model:display-name="form.display_name"
        v-model:army-list-type-id="form.army_list_type_id"
        v-model:custom-max-points="form.custom_max_points"
        :errors="form.errors"
    />

    <ArmyListTable
        :units="units"
        :show-controls="true"
        @add="add"
        @subtract="subtract"
        @remove="remove"
    />

    <UnitPicker @add="add" />

    <ArmyListSaveBar
        :total-cost="totalCost"
        :max-points="maxPoints"
        :processing="form.processing"
        :save-disabled="!auth.user"
        @save="save"
    >
        <template v-if="!auth.user" #note>
            An account is required to save.
            <Link :href="login()" class="link-light">Login</Link>
            or
            <Link :href="register()" class="link-light">Register</Link>.
        </template>
    </ArmyListSaveBar>
</template>
