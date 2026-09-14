<script setup lang="ts">
import { Form, Head, router } from '@inertiajs/vue3'
import ArmyListController from '@/actions/App/Http/Controllers/ArmyListController'
import InputError from '@/components/InputError.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import Spinner from '@/components/Spinner.vue'
import TextLink from '@/components/TextLink.vue'
import { hasArmyListDraft } from '@/lib/armyListDraft'
import { login } from '@/routes'
import { store } from '@/routes/register'

defineProps<{
    passwordRules: string
}>()

defineOptions({
    layout: {
        title: 'Create an account',
        description: 'Enter your details below to create your account',
    },
})

function redirectToArmyListDraft() {
    if (hasArmyListDraft()) {
        router.visit(ArmyListController.create.url())
    }
}
</script>

<template>
    <Head title="Register" />

    <Form
        v-bind="store.form()"
        :reset-on-success="['password', 'password_confirmation']"
        v-slot="{ errors, processing }"
        class="d-flex flex-column gap-3"
        @success="redirectToArmyListDraft"
    >
        <div>
            <label for="name" class="form-label">Name</label>
            <input
                id="name"
                type="text"
                required
                autofocus
                :tabindex="1"
                autocomplete="name"
                name="name"
                class="form-control"
                placeholder="Full name"
            />
            <InputError :message="errors.name" />
        </div>

        <div>
            <label for="email" class="form-label">Email address</label>
            <input
                id="email"
                type="email"
                required
                :tabindex="2"
                autocomplete="email"
                name="email"
                class="form-control"
                placeholder="email@example.com"
            />
            <InputError :message="errors.email" />
        </div>

        <div>
            <label for="password" class="form-label">Password</label>
            <PasswordInput
                id="password"
                required
                :tabindex="3"
                autocomplete="new-password"
                name="password"
                placeholder="Password"
                :passwordrules="passwordRules"
            />
            <InputError :message="errors.password" />
        </div>

        <div>
            <label for="password_confirmation" class="form-label"
                >Confirm password</label
            >
            <PasswordInput
                id="password_confirmation"
                required
                :tabindex="4"
                autocomplete="new-password"
                name="password_confirmation"
                placeholder="Confirm password"
                :passwordrules="passwordRules"
            />
            <InputError :message="errors.password_confirmation" />
        </div>

        <button
            type="submit"
            class="btn btn-primary w-100 mt-2"
            tabindex="5"
            :disabled="processing"
            data-test="register-user-button"
        >
            <Spinner v-if="processing" />
            Create account
        </button>

        <div class="text-secondary text-center small">
            Already have an account?
            <TextLink :href="login()" :tabindex="6">Log in</TextLink>
        </div>
    </Form>
</template>
