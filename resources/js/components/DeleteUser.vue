<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';

const passwordInput = useTemplateRef('passwordInput');
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
                data-bs-toggle="modal"
                data-bs-target="#delete-user-modal"
            >
                Delete account
            </button>
        </div>

        <div
            id="delete-user-modal"
            class="modal fade"
            tabindex="-1"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <Form
                        v-bind="ProfileController.destroy.form()"
                        reset-on-success
                        @error="() => passwordInput?.focus()"
                        :options="{
                            preserveScroll: true,
                        }"
                        v-slot="{ errors, processing, reset, clearErrors }"
                    >
                        <div class="modal-header">
                            <h5 class="modal-title">
                                Are you sure you want to delete your account?
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                @click="
                                    () => {
                                        clearErrors();
                                        reset();
                                    }
                                "
                            ></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-3">
                                Once your account is deleted, all of its
                                resources and data will also be permanently
                                deleted. Please enter your password to confirm
                                you would like to permanently delete your
                                account.
                            </p>

                            <label for="password" class="visually-hidden"
                                >Password</label
                            >
                            <PasswordInput
                                id="password"
                                name="password"
                                ref="passwordInput"
                                placeholder="Password"
                            />
                            <InputError :message="errors.password" />
                        </div>

                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                                @click="
                                    () => {
                                        clearErrors();
                                        reset();
                                    }
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="btn btn-danger"
                                :disabled="processing"
                                data-test="confirm-delete-user-button"
                            >
                                Delete account
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
