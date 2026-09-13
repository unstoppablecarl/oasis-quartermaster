<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3';
import Heading from '../../components/Heading.vue';
import Layout from '../../layouts/army-lists/Layout.vue';
import { index, show } from '../../routes/army-lists';
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
            title: 'View',
            href: show(armyList.uuid),
        },
    ],
});
</script>
<template>
    <Layout>
        <Head title="Show" />
        <h1 class="visually-hidden">Show</h1>

        <div class="d-flex flex-column gap-4">
            <Heading variant="small" :title="armyList.display_name" />
            sadffadssfd
        </div>
    </Layout>
</template>
