<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserMenuContent from '@/components/UserMenuContent.vue'
import { useCurrentUrl } from '@/composables/useCurrentUrl'
import { dashboard, diceRoller, rules } from '@/routes'
import { index as armyLists } from '@/routes/army-lists'
import type { BreadcrumbItem, NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
})

const page = usePage()
const auth = computed(() => page.props.auth)
const { isCurrentOrParentUrl } = useCurrentUrl()

const mainNavItems: NavItem[] = [

    {
        title: 'Army Lists',
        href: armyLists(),
    },
    {
        title: 'Rules',
        href: rules(),
    },
    {
        title: 'Dice Roller',
        href: diceRoller(),
    },
]
</script>

<template>
    <div class="container d-flex app-header">
        <Link
            :href="dashboard()"
            class="navbar-brand me-auto"
        >
            <img src="/images/logo.png" alt="Oasis Logo" height="24" class="d-inline-block align-text-top">

            Quartermaster
        </Link>

        <div class="dropdown">
            <button
                class="btn d-flex align-items-center gap-2 border-0 shadow-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <UserInfo :user="auth.user" />
            </button>
            <ul class="dropdown-menu dropdown-menu-end dropdown-user-context">
                <UserMenuContent :user="auth.user" />
            </ul>
        </div>
    </div>
    <nav class="navbar navbar-dark navbar-expand-lg">
        <div class="container">
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

            <div id="app-navbar-collapse" class="collapse navbar-collapse border-bottom">
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
