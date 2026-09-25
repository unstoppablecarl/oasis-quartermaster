<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3'
import Spinner from '@/components/Spinner.vue'
import TextLink from '@/components/TextLink.vue'
import { logout } from '@/routes'
import { send } from '@/routes/verification'

defineOptions({
    layout: {
        title: 'Email verification',
        description:
            'Please verify your email address by clicking on the link we just emailed to you.',
    },
})

defineProps<{
    status?: string
}>()
</script>

<template>
    <Head title="Email verification" />

    <div
        v-if="status === 'verification-link-sent'"
        class="mb-3 text-center small fw-medium text-success"
    >
        A new verification link has been sent to the email address you provided
        during registration.
    </div>

    <Form
        v-bind="send.form()"
        class="d-flex flex-column gap-3 text-center"
        v-slot="{ processing }"
    >
        <button :disabled="processing" class="btn btn-secondary">
            <Spinner v-if="processing" />
            Resend verification email
        </button>

        <TextLink :href="logout()" as="button" class="mx-auto d-block small">
            Log out
        </TextLink>
    </Form>
</template>
