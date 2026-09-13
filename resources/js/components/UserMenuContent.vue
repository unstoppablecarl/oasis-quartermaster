<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { LogOut, Settings } from '@lucide/vue';
import UserInfo from '@/components/UserInfo.vue';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

const handleLogout = () => {
    router.flushAll();
};

defineProps<Props>();
</script>

<template>
    <li>
        <span class="dropdown-item-text d-flex align-items-center gap-2">
            <UserInfo :user="user" :show-email="true" />
        </span>
    </li>
    <li><hr class="dropdown-divider" /></li>
    <li>
        <Link
            class="dropdown-item d-flex align-items-center gap-2"
            :href="edit()"
            prefetch
        >
            <Settings :size="16" />
            Settings
        </Link>
    </li>
    <li><hr class="dropdown-divider" /></li>
    <li>
        <Link
            class="dropdown-item d-flex align-items-center gap-2"
            :href="logout()"
            @click="handleLogout"
            as="button"
            data-test="logout-button"
        >
            <LogOut :size="16" />
            Log out
        </Link>
    </li>
</template>
