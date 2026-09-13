<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { create, index } from '@/routes/army-lists';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'All',
        href: index(),
    },
    {
        title: 'Create',
        href: create(),
    },
];

const { isCurrentUrl } = useCurrentUrl();
</script>

<template>
    <div>
        <Heading title="Army Lists" />

        <div class="row">
            <aside class="col-12 col-lg-3 mb-4 mb-lg-0">
                <nav class="nav flex-column nav-pills" aria-label="Army Lists">
                    <Link
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        :href="item.href"
                        class="nav-link text-body"
                        :class="{ active: isCurrentUrl(item.href) }"
                    >
                        {{ item.title }}
                    </Link>
                </nav>
            </aside>

            <div class="col-12 col-lg-9">
                <section style="max-width: 40rem">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
