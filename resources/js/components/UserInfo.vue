<script setup lang="ts">
import { computed } from 'vue';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';

type Props = {
    user: User;
    showEmail?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    showEmail: false,
});

const { getInitials } = useInitials();

const showAvatar = computed(
    () => props.user.avatar && props.user.avatar !== '',
);
</script>

<template>
    <img
        v-if="showAvatar"
        :src="user.avatar!"
        :alt="user.name"
        class="rounded-circle"
        style="width: 2rem; height: 2rem; object-fit: cover"
    />
    <div
        v-else
        class="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white fw-semibold flex-shrink-0"
        style="width: 2rem; height: 2rem; font-size: 0.75rem"
    >
        {{ getInitials(user.name) }}
    </div>

    <div class="text-start lh-sm">
        <div class="fw-medium text-truncate">{{ user.name }}</div>
        <div v-if="showEmail" class="text-secondary small text-truncate">
            {{ user.email }}
        </div>
    </div>
</template>
