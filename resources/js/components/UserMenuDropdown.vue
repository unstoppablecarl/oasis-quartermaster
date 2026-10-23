<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue'
import UserMenuContent from '@/components/UserMenuContent.vue'
import type { User } from '@/types'
import { BDropdown } from 'bootstrap-vue-next'

defineProps<{
    user: User
}>()
</script>

<template>
    <BDropdown
        :variant="null"
        no-caret
        placement="bottom-end"
        toggle-class="d-flex align-items-center gap-2 border-0 shadow-none dropdown-user-context"
        menu-class="dropdown-user-context"
    >
        <template #button-content>
            <UserInfo :user="user" />
        </template>
        <UserMenuContent :user="user" />
    </BDropdown>
</template>
