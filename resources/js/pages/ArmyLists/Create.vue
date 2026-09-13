<script setup lang="ts">
import Layout from '@/layouts/army-lists/Layout.vue'
import { Form, Head } from '@inertiajs/vue3'
import ArmyListController from '../../actions/App/Http/Controllers/ArmyListController'
import Heading from '../../components/Heading.vue'
import InputError from '../../components/InputError.vue'
</script>
<template>
    <Layout>
        <Head title="Create" />
        <h1 class="visually-hidden">Create</h1>

        <div class="d-flex flex-column gap-4">
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
        </div>
    </Layout>
</template>
