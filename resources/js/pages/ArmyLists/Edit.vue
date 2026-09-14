<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import InputError from '../../components/InputError.vue'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'

const { armyList } = defineProps<{
    armyList: ArmyList;
}>()
</script>
<template>
    <ArmyListItemLayout :army-list="armyList">

        <Head title="Edit" />

        <Form
            v-bind="ArmyListController.update.form(armyList)"
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
                    v-model="armyList.display_name"
                />
                <InputError class="mt-2" :message="errors.name" />
            </div>

            <div class="d-flex align-items-center gap-3">
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="processing"
                >
                    Save
                </button>
            </div>
        </Form>
    </ArmyListItemLayout>
</template>
