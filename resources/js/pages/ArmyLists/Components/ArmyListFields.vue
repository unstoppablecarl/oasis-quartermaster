<script setup lang="ts">
import { BFormCheckbox } from 'bootstrap-vue-next'
import { computed, watch } from 'vue'
import { ARMY_LIST_TYPES } from '../../../../data/army-list-types'
import InputError from '../../../components/InputError.vue'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'
import BtnCopyLink from './BtnCopyLink.vue'

const { armyList, errors, isCreating = false } = defineProps<{
    armyList: Pick<
        LocalArmyList,
        'display_name' | 'army_list_type_id' | 'custom_max_points' | 'public' | 'uuid'
    >
    errors?: Partial<
        Record<
            'display_name' | 'army_list_type_id' | 'custom_max_points' | 'public',
            string
        >
    >
    isCreating?: boolean
}>()

const allArmyListTypes = Object.values(ARMY_LIST_TYPES)
const isCustomArmyListType = computed(() => armyList.army_list_type_id === null)

watch(isCustomArmyListType, (isCustom) => {
    if (!isCustom) {
        armyList.custom_max_points = null
    }
})
</script>
<template>
    <div class="row mb-3">
        <div class="col">
            <label for="display_name" class="form-label title-font">Name</label>
            <input
                id="display_name"
                type="text"
                class="form-control"
                name="display_name"
                required
                placeholder="Name"
                v-model="armyList.display_name"
            />
            <InputError class="mt-2" :message="errors?.display_name" />
        </div>

        <div class="col">
            <label for="army_list_type_id" class="form-label title-font">
                Type
            </label>
            <select
                id="army_list_type_id"
                class="form-select"
                name="army_list_type_id"
                v-model="armyList.army_list_type_id"
            >
                <option
                    v-for="armyListType in allArmyListTypes"
                    :key="armyListType.id"
                    :value="armyListType.id"
                >
                    {{ armyListType.display_name }} -
                    {{ armyListType.max_points }} Points
                </option>
                <option :value="null">Custom</option>
            </select>
            <InputError class="mt-2" :message="errors?.army_list_type_id" />
        </div>

        <div class="col" v-if="!isCreating">
            <label for="army_list_type_id" class="form-label title-font">
                Visibility
            </label>
            <div class="d-flex">
                <div>
                    <BFormCheckbox
                        id="public"
                        v-model="armyList.public"
                        name="public"
                        :value="1"
                        :unchecked-value="0"
                        class="py-1"
                    >
                        Publicly Visible
                    </BFormCheckbox>

                    <InputError class="mt-2" :message="errors?.public" />
                </div>
                <div class="ms-2" v-if="armyList.uuid">
                    <BtnCopyLink :army-list-uuid="armyList.uuid" :disabled="!armyList.public"  />
                </div>
            </div>
        </div>
    </div>
    <div class="mb-3" v-if="isCustomArmyListType">
        <label for="custom_max_points" class="form-label title-font"
        >Custom Max Points</label
        >
        <input
            id="custom_max_points"
            type="number"
            min="1"
            class="form-control"
            name="custom_max_points"
            required
            v-model.number="armyList.custom_max_points"
        />
        <InputError class="mt-2" :message="errors?.custom_max_points" />
    </div>
</template>
