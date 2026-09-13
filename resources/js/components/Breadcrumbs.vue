<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type Props = {
    breadcrumbs: BreadcrumbItemType[];
};

defineProps<Props>();
</script>

<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
            <li
                v-for="(item, index) in breadcrumbs"
                :key="index"
                class="breadcrumb-item"
                :class="{ active: index === breadcrumbs.length - 1 }"
                :aria-current="
                    index === breadcrumbs.length - 1 ? 'page' : undefined
                "
            >
                <span v-if="index === breadcrumbs.length - 1">{{
                    item.title
                }}</span>
                <Link v-else :href="item.href">{{ item.title }}</Link>
            </li>
        </ol>
    </nav>
</template>
