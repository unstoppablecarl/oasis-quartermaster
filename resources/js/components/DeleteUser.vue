<script setup lang="ts">
import type { FormComponentRef } from '@inertiajs/core'
import { Form } from '@inertiajs/vue3'
import { BModal } from 'bootstrap-vue-next'
import { ref, useTemplateRef } from 'vue'
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController'
import Heading from '@/components/Heading.vue'
import InputError from '@/components/InputError.vue'
import PasswordInput from '@/components/PasswordInput.vue'

const passwordInput = useTemplateRef('passwordInput')
const deleteUserForm = useTemplateRef<FormComponentRef>('deleteUserForm')
const isModalVisible = ref(false)

function resetForm() {
    deleteUserForm.value?.clearErrors()
    deleteUserForm.value?.reset()
}
</script>

<template>
    <div>
        <Heading
            variant="small"
            title="Delete account"
            description="Delete your account and all of its resources"
        />
        <div class="p-3 rounded border border-danger-subtle bg-danger-subtle">
            <p class="fw-medium text-danger-emphasis mb-1">Warning</p>
            <p class="small text-danger-emphasis mb-3">
                Please proceed with caution, this cannot be undone.
            </p>
            <button
                type="button"
                class="btn btn-danger"
                data-test="delete-user-button"
                @click="isModalVisible = true"
            >
                Delete account
            </button>
        </div>

        <BModal
            v-model="isModalVisible"
            title="Are you sure you want to delete your account?"
            @hidden="resetForm"
        >
            <Form
                ref="deleteUserForm"
                v-bind="ProfileController.destroy.form()"
                reset-on-success
                @error="() => passwordInput?.focus()"
                :options="{
                    preserveScroll: true,
                }"
                v-slot="{ errors }"
            >
                <p class="mb-3">
                    Once your account is deleted, all of its resources and data
                    will also be permanently deleted. Please enter your password
                    to confirm you would like to permanently delete your
                    account.
                </p>

                <label for="password" class="visually-hidden">Password</label>
                <PasswordInput
                    id="password"
                    name="password"
                    ref="passwordInput"
                    placeholder="Password"
                />
                <InputError :message="errors.password" />
            </Form>

            <template #footer>
                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="isModalVisible = false"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="btn btn-danger"
                    :disabled="deleteUserForm?.processing"
                    data-test="confirm-delete-user-button"
                    @click="deleteUserForm?.submit()"
                >
                    Delete account
                </button>
            </template>
        </BModal>
    </div>
</template>
