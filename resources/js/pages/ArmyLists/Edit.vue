<script setup lang="ts">
import { Form, Head, setLayoutProps } from '@inertiajs/vue3';
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController';
import Heading from '../../components/Heading.vue';
import InputError from '../../components/InputError.vue';
import Layout from '../../layouts/army-lists/Layout.vue';
import { edit, index } from '../../routes/army-lists';
import type { ArmyList } from '../../types/army-list';

const { armyList } = defineProps<{
    armyList: ArmyList;
}>();

setLayoutProps({
    breadcrumbs: [
        {
            title: 'Army Lists',
            href: index(),
        },
        {
            title: 'Edit',
            href: edit(armyList.uuid),
        },
    ],
});
</script>
<template>
    <Layout>
        <Head title="Edit" />
        <h1 class="visually-hidden">Edit</h1>

        <div class="d-flex flex-column gap-4">
            <Heading variant="small" title="Edit" />

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
        </div>
    </Layout>
</template>
