<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import UserInfo from '@/components/UserInfo.vue';
import UserMenuContent from '@/components/UserMenuContent.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { index as armyLists } from '@/routes/army-lists';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const auth = computed(() => page.props.auth);
const { isCurrentOrParentUrl } = useCurrentUrl();

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Army Lists',
        href: armyLists(),
    },
];
</script>

<template>
    <nav class="navbar navbar-expand-lg border-bottom bg-body">
        <div class="container-fluid">
            <Link
                :href="dashboard()"
                class="navbar-brand d-flex align-items-center"
            >
                <AppLogo />
            </Link>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#app-navbar-collapse"
                aria-controls="app-navbar-collapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div id="app-navbar-collapse" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li
                        v-for="item in mainNavItems"
                        :key="item.title"
                        class="nav-item"
                    >
                        <Link
                            :href="item.href"
                            class="nav-link"
                            :class="{ active: isCurrentOrParentUrl(item.href) }"
                        >
                            {{ item.title }}
                        </Link>
                    </li>
                </ul>

                <div class="dropdown">
                    <button
                        class="btn d-flex align-items-center gap-2 border-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <UserInfo :user="auth.user" />
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <UserMenuContent :user="auth.user" />
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <div
        v-if="props.breadcrumbs.length > 1"
        class="border-bottom bg-body-tertiary"
    >
        <div class="container-fluid py-2">
            <Breadcrumbs :breadcrumbs="breadcrumbs" />
        </div>
    </div>
</template>
