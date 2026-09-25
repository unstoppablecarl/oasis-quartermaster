<script setup lang="ts">
import { useInitials } from '@/composables/useInitials'
import type { User } from '@/types'

type Props = {
    user: User;
    showEmail?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    showEmail: false,
})

const { getInitials } = useInitials()

</script>
<template>
    <div
        class="d-flex align-items-center justify-content-center rounded-circle bg-primary text-black fw-semibold flex-shrink-0"
        style="width: 2rem; height: 2rem; font-size: 0.75rem"
    >
        {{ getInitials(user.name) }}
    </div>

    <div class="text-start lh-sm body-font">
        <div class="fw-medium text-truncate">{{ user.name }}</div>
        <div v-if="showEmail" class="text-secondary small text-truncate">
            {{ user.email }}
        </div>
    </div>
</template>
