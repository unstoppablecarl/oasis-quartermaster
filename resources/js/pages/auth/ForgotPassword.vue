<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3'
import InputError from '@/components/InputError.vue'
import Spinner from '@/components/Spinner.vue'
import TextLink from '@/components/TextLink.vue'
import { login } from '@/routes'
import { email } from '@/routes/password'

defineOptions({
    layout: {
        title: 'Forgot password',
        description: 'Enter your email to receive a password reset link',
    },
})

defineProps<{
    status?: string
}>()
</script>

<template>
    <Head title="Forgot password" />

    <div v-if="status" class="mb-3 text-center small fw-medium text-success">
        {{ status }}
    </div>

    <div class="d-flex flex-column gap-4">
        <Form v-bind="email.form()" v-slot="{ errors, processing }">
            <div>
                <label for="email" class="form-label">Email address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    autocomplete="off"
                    autofocus
                    class="form-control"
                    placeholder="email@example.com"
                />
                <InputError :message="errors.email" />
            </div>

            <div class="my-4">
                <button
                    class="btn btn-primary w-100"
                    :disabled="processing"
                    data-test="email-password-reset-link-button"
                >
                    <Spinner v-if="processing" />
                    Email password reset link
                </button>
            </div>
        </Form>

        <div class="text-secondary text-center small">
            <span>Or, return to</span>
            <TextLink :href="login()">log in</TextLink>
        </div>
    </div>
</template>
