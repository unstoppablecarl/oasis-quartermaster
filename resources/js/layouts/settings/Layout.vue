<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Heading from '@/components/Heading.vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: editProfile(),
    },
    {
        title: 'Security',
        href: editSecurity(),
    },
    {
        title: 'Appearance',
        href: editAppearance(),
    },
];

const { isCurrentOrParentUrl } = useCurrentUrl();
</script>

<template>
    <div>
        <Heading
            title="Settings"
            description="Manage your profile and account settings"
        />

        <div class="row">
            <aside class="col-12 col-lg-3 mb-4 mb-lg-0">
                <nav class="nav flex-column nav-pills" aria-label="Settings">
                    <Link
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        :href="item.href"
                        class="nav-link text-body"
                        :class="{ active: isCurrentOrParentUrl(item.href) }"
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
