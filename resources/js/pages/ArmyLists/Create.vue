<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { computed, watch } from 'vue'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import { useArmyList } from '../../composables/useArmyList'
import { clearArmyListDraft, loadArmyListDraft, saveArmyListDraft } from '../../lib/armyListDraft'
import { login, register } from '../../routes'
import ArmyListFields from './Components/ArmyListFields.vue'
import ArmyListItemHeader from './Components/ArmyListItemHeader.vue'
import ArmyListSaveBar from './Components/ArmyListSaveBar.vue'
import ArmyListUnits from './Components/ArmyListUnits.vue'
import UnitPicker from './Components/UnitPicker.vue'

const page = usePage()
const auth = computed(() => page.props.auth)

const draft = loadArmyListDraft()
const form = useForm(draft)

const { add, subtract, remove, totalCost, unitCount, maxPoints } = useArmyList(form)

watch(
    [
        () => form.display_name,
        () => form.army_list_type_id,
        () => form.custom_max_points,
        () => form.units,
    ],
    () => {
        if (auth.value.user) {
            return
        }

        saveArmyListDraft(form)
    },
    { deep: true },
)

function save() {
    if (!auth.value.user) {
        return
    }

    form.post(ArmyListController.store.url(), {
        onSuccess: () => {
            clearArmyListDraft()
        },
    })
}
</script>
<template>
    <Head title="Create" />

    <ArmyListItemHeader title="Create" description="Army List" />

    <ArmyListFields :army-list="form" :errors="form.errors" />

    <ArmyListUnits
        :units="form.units"
        :show-controls="true"
        :max-points="maxPoints"
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
        :unit-count="unitCount"
        @save="save"
    >
        <template v-if="!auth.user" #note>
            An account is required to save.
            <Link :href="login()" class="link-light">Login</Link>
            or
            <Link :href="register()" class="link-light">Register</Link>
            .
        </template>
    </ArmyListSaveBar>
</template>
