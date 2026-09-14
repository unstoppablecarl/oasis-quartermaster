<script setup lang="ts">
import { Form, Head, router } from '@inertiajs/vue3'
import ArmyListController from '@/actions/App/Http/Controllers/ArmyListController'
import InputError from '@/components/InputError.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import Spinner from '@/components/Spinner.vue'
import TextLink from '@/components/TextLink.vue'
import { hasArmyListDraft } from '@/lib/armyListDraft'
import { register } from '@/routes'
import { store } from '@/routes/login'
import { request } from '@/routes/password'

defineOptions({
    layout: {
        title: 'Log in to your account',
        description: 'Enter your email and password below to log in',
    },
})

defineProps<{
    status?: string
    canResetPassword: boolean
}>()

function redirectToArmyListDraft() {
    if (hasArmyListDraft()) {
        router.visit(ArmyListController.create.url())
    }
}
</script>

<template>
    <Head title="Log in" />

    <div v-if="status" class="mb-3 text-center small fw-medium text-success">
        {{ status }}
    </div>

    <Form
        v-bind="store.form()"
        :reset-on-success="['password']"
        v-slot="{ errors, processing }"
        class="d-flex flex-column gap-3"
        @success="redirectToArmyListDraft"
    >
        <div>
            <label for="email" class="form-label">Email address</label>
            <input
                id="email"
                type="email"
                name="email"
                required
                autofocus
                :tabindex="1"
                autocomplete="email"
                class="form-control"
                placeholder="email@example.com"
            />
            <InputError :message="errors.email" />
        </div>

        <div>
            <div class="d-flex align-items-center justify-content-between">
                <label for="password" class="form-label mb-0">Password</label>
                <TextLink
                    v-if="canResetPassword"
                    :href="request()"
                    class="small"
                    :tabindex="5"
                >
                    Forgot your password?
                </TextLink>
            </div>
            <PasswordInput
                id="password"
                name="password"
                required
                :tabindex="2"
                autocomplete="current-password"
                placeholder="Password"
                class="mt-1"
            />
            <InputError :message="errors.password" />
        </div>

        <div class="form-check">
            <input
                id="remember"
                class="form-check-input"
                type="checkbox"
                name="remember"
                :tabindex="3"
            />
            <label class="form-check-label" for="remember">Remember me</label>
        </div>

        <button
            type="submit"
            class="btn btn-primary w-100 mt-2"
            :tabindex="4"
            :disabled="processing"
            data-test="login-button"
        >
            <Spinner v-if="processing" />
            Log in
        </button>

        <div class="text-secondary text-center small">
            Don't have an account?
            <TextLink :href="register()" :tabindex="5">Sign up</TextLink>
        </div>
    </Form>
</template>
