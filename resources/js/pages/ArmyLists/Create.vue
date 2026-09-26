<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import { useArmyList } from '../../composables/useArmyList'
import {
    clearArmyListDraft,
    loadArmyListDraft,
    saveArmyListDraft,
} from '../../lib/armyListDraft'
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

const { add, subtract, remove, reorder, totalCost, unitCount, maxPoints } =
    useArmyList(form)

watch(
    [
        () => form.display_name,
        () => form.army_list_type_id,
        () => form.custom_max_points,
        () => form.units,
        () => form.public,
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
        onError: (errors) => {
            const messages = Object.values(errors).flat()
            toast.error(
                messages.length
                    ? messages.join('\n')
                    : 'Failed to save army list',
            )
        },
    })
}
</script>
<template>
    <Head title="Create" />

    <ArmyListItemHeader title="Create" description="Army List" />

    <ArmyListFields
        :is-creating="true"
        :army-list="form"
        :errors="form.errors"
    />

    <Teleport to="#before-page-footer-teleport" defer>
        <div class="container-fluid">
            <ArmyListUnits :army-list="form" />
            <UnitPicker @add="add" :army-list="form" />
        </div>
    </Teleport>

    <ArmyListSaveBar
        :name="form.display_name"
        :faction-id="form.faction_id"
        :total-cost="totalCost"
        :max-points="maxPoints"
        :processing="form.processing"
        :save-disabled="!auth.user"
        :unit-count="unitCount"
        :command-ids="form.commands.map(({ id }) => id)"
        @save="save"
        :autosave="false"
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
