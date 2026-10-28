<script setup lang="ts">
import UserMenuDropdown from '@/components/UserMenuDropdown.vue'
import { useCurrentUrl } from '@/composables/useCurrentUrl'
import { diceRoller, home, login, printCards, register, rules } from '@/routes'
import { create, index as armyLists } from '@/routes/army-lists'
import type { NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/vue3'
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'
import { BCollapse, BNavbarToggle, BNavItemDropdown } from 'bootstrap-vue-next'
import { computed } from 'vue'

const page = usePage()
const auth = computed(() => page.props.auth)
const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl()
const isDesktop = useBreakpoints(breakpointsBootstrapV5).greaterOrEqual('lg')

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
    {
        title: 'Print Cards',
        href: printCards(),
    },
])

const isVisible = (item: NavItem) => item.visible?.() ?? true
</script>

<template>
    <div class="app-header">
        <div class="container d-flex navbar pb-0">
            <div class="container">
                <Link :href="home()" class="navbar-brand me-auto">
                    <img
                        src="/images/logo.svg"
                        alt="Oasis Logo"
                        class="logo-img"
                    />

                    <span class="text-sulfur title fs-2 ms-2 logo-subheading">
                        Quartermaster
                    </span>
                </Link>

                <UserMenuDropdown
                    v-if="auth.user && isDesktop"
                    :user="auth.user"
                />
                <div
                    v-else-if="!auth.user"
                    class="d-flex align-items-center gap-2"
                >
                    <Link :href="login()" class="btn btn-outline-secondary">
                        Login
                    </Link>
                    <Link :href="register()" class="btn btn-primary">
                        Register
                    </Link>
                </div>
            </div>
        </div>

        <nav
            class="navbar navbar-dark navbar-expand-lg border-bottom pb-2 pb-sm-0"
        >
            <div class="container">
                <BNavbarToggle target="app-navbar-collapse" />

                <UserMenuDropdown
                    v-if="auth.user && !isDesktop"
                    :user="auth.user"
                    class="ms-auto"
                />

                <BCollapse id="app-navbar-collapse" is-nav>
                    <ul class="navbar-nav me-auto">
                        <template
                            v-for="item in mainNavItems.filter(isVisible)"
                            :key="item.title"
                        >
                            <BNavItemDropdown
                                v-if="item.children?.length"
                                :text="item.title"
                                class="position-relative"
                                :toggle-class="{
                                    active: isCurrentOrParentUrl(item.href),
                                }"
                            >
                                <li
                                    v-for="child in item.children?.filter(
                                        isVisible,
                                    )"
                                    :key="child.title"
                                >
                                    <Link
                                        :href="child.href"
                                        class="dropdown-item"
                                        :class="{
                                            active: isCurrentUrl(child.href),
                                        }"
                                    >
                                        {{ child.title }}
                                    </Link>
                                </li>
                            </BNavItemDropdown>
                            <li v-else class="nav-item position-relative">
                                <Link
                                    :href="item.href"
                                    class="nav-link"
                                    :class="{ active: isCurrentUrl(item.href) }"
                                >
                                    {{ item.title }}
                                </Link>
                            </li>
                        </template>
                        <li class="nav-item position-relative">
                            <a
                                class="nav-link"
                                href="https://oasiswargame.com"
                                target="_blank"
                                >oasiswargame.com</a
                            >
                        </li>
                    </ul>
                </BCollapse>
            </div>
        </nav>
    </div>
</template>
<style lang="scss">
.logo-subheading {
    vertical-align: middle;
}
</style>
