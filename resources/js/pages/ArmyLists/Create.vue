<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import Heading from '../../components/Heading.vue'
import InputError from '../../components/InputError.vue'
import { ARMY_LIST_TYPES } from '../../data/army-list-types'

const allArmyListTypes = Object.values(ARMY_LIST_TYPES)
const armyListTypeId = ref<number | null>(allArmyListTypes[0]?.id ?? null)
const isCustomArmyListType = computed(() => armyListTypeId.value === null)
</script>
<template>

    <Head title="Create" />

    <Heading variant="small" title="Create" />

    <Form
        v-bind="ArmyListController.store.form()"
        v-slot="{ errors, processing }"
    >
        <div class="mb-3">
            <label for="display_name" class="form-label">Name</label>
            <input
                id="display_name"
                type="text"
                class="form-control"
                name="display_name"
                required
                placeholder="Name"
            />
            <InputError class="mt-2" :message="errors.name" />
        </div>

        <div class="mb-3">
            <label for="army_list_type_id" class="form-label">Type</label>
            <select
                id="army_list_type_id"
                class="form-select"
                name="army_list_type_id"
                v-model="armyListTypeId"
            >
                <option v-for="armyListType in allArmyListTypes" :key="armyListType.id" :value="armyListType.id">
                    {{ armyListType.display_name }}
                </option>
                <option :value="null">Custom</option>
            </select>
            <InputError class="mt-2" :message="errors.army_list_type_id" />
        </div>

        <div class="mb-3" v-if="isCustomArmyListType">
            <label for="custom_max_points" class="form-label">Custom Max Points</label>
            <input
                id="custom_max_points"
                type="number"
                min="1"
                class="form-control"
                name="custom_max_points"
                required
            />
            <InputError class="mt-2" :message="errors.custom_max_points" />
        </div>

        <div class="d-flex align-items-center gap-3">
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="processing"
            >
                Create
            </button>
        </div>
    </Form>
</template>
