<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue'
import UserMenuContent from '@/components/UserMenuContent.vue'
import { useCurrentUrl } from '@/composables/useCurrentUrl'
import { diceRoller, home, login, register, rules } from '@/routes'
import { create, index as armyLists } from '@/routes/army-lists'
import type { NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const auth = computed(() => page.props.auth)
const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl()

const mainNavItems = computed<NavItem[]>(() => [
    {
        title: 'Army Lists',
        href: armyLists(),
        children: [
            {
                title: 'Manage',
                href: armyLists(),
                visible: () => !!auth.value.user,
            },
            {
                title: 'Create',
                href: create(),
            },
        ],
    },
    {
        title: 'Rules',
        href: rules(),
    },
    {
        title: 'Dice Roller',
        href: diceRoller(),
    },
])

const isVisible = (item: NavItem) => item.visible?.() ?? true
</script>

<template>
    <div class="container d-flex app-header navbar pb-0">
        <div class="container">
            <Link
                :href="home()"
                class="navbar-brand me-auto"
            >
                <img src="/images/logo.svg" alt="Oasis Logo" class="logo-img">

                <span class="text-sulfur title fs-2 ms-2">
                Quartermaster
                </span>
            </Link>

            <div v-if="auth.user" class="dropdown">
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
            <div v-else class="d-flex align-items-center gap-2">
                <Link :href="login()" class="btn btn-outline-secondary">
                    Login
                </Link>
                <Link :href="register()" class="btn btn-primary">
                    Register
                </Link>
            </div>
        </div>
    </div>

    <nav class="navbar navbar-dark navbar-expand-lg border-bottom">
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

            <div id="app-navbar-collapse" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li
                        v-for="item in mainNavItems.filter(isVisible)"
                        :key="item.title"
                        class="nav-item position-relative"
                    >
                        <template v-if="item.children?.length">
                            <a
                                class="nav-link dropdown-toggle"

                                :class="{'active': isCurrentOrParentUrl(item.href)}"
                                href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Army Lists
                            </a>
                            <ul class="dropdown-menu">
                                <li v-for="child in item.children?.filter(isVisible)" :key="child.title">
                                    <Link
                                        :href="child.href"
                                        class="dropdown-item"
                                        :class="{ active: isCurrentUrl(child.href) }"
                                    >
                                        {{ child.title }}
                                    </Link>
                                </li>
                            </ul>
                        </template>
                        <Link
                            v-else
                            :href="item.href"
                            class="nav-link"
                            :class="{ active: isCurrentUrl(item.href) }"
                        >
                            {{ item.title }}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
