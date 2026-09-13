<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import Layout from '@/layouts/army-lists/Layout.vue';
import { edit, index, show } from '@/routes/army-lists';
import type { ArmyList } from '@/types/army-list';

const props = defineProps<{
    armyLists: ArmyList[];
}>();
</script>
<template>
    <Layout>
        <Head title="Index" />
        <h1 class="visually-hidden">Army Lists</h1>
        <div class="d-flex flex-column gap-4">
            <Heading variant="small" title="Army Lists" />

            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="props.armyLists.length === 0">
                        <td colspan="2" class="text-secondary text-center">
                            No army lists yet.
                        </td>
                    </tr>
                    <tr v-for="item in props.armyLists" :key="item.uuid">
                        <td class="fw-medium">
                            {{ item.display_name }}
                        </td>
                        <td class="text-end">
                            <div class="d-flex justify-content-end gap-2">
                                <Link
                                    :href="show(item.uuid)"
                                    class="btn btn-sm btn-outline-secondary"
                                    >View</Link
                                >
                                <Link
                                    v-if="item.can.update"
                                    :href="edit(item.uuid)"
                                    class="btn btn-sm btn-outline-secondary"
                                    >Edit</Link
                                >
                                <button
                                    v-if="item.can.delete"
                                    type="button"
                                    class="btn btn-sm btn-outline-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Layout>
</template>
