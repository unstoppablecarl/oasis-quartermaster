<script setup lang="ts">
import { computed, watch } from 'vue'
import InputError from '../../components/InputError.vue'
import { ARMY_LIST_TYPES } from '../../data/army-list-types'

const displayName = defineModel<string>('displayName', { required: true })
const armyListTypeId = defineModel<number | null>('armyListTypeId', {
    required: true,
})
const customMaxPoints = defineModel<number | null>('customMaxPoints', {
    required: true,
})

defineProps<{
    errors?: Partial<
        Record<
            'display_name' | 'army_list_type_id' | 'custom_max_points',
            string
        >
    >
}>()

const allArmyListTypes = Object.values(ARMY_LIST_TYPES)
const isCustomArmyListType = computed(() => armyListTypeId.value === null)

watch(isCustomArmyListType, (isCustom) => {
    if (!isCustom) {
        customMaxPoints.value = null
    }
})
</script>
<template>
    <div class="mb-3">
        <label for="display_name" class="form-label title-font">Name</label>
        <input
            id="display_name"
            type="text"
            class="form-control"
            name="display_name"
            required
            placeholder="Name"
            v-model="displayName"
        />
        <InputError class="mt-2" :message="errors?.display_name" />
    </div>

    <div class="mb-3">
        <label for="army_list_type_id" class="form-label title-font"
            >Type</label
        >
        <select
            id="army_list_type_id"
            class="form-select"
            name="army_list_type_id"
            v-model="armyListTypeId"
        >
            <option
                v-for="armyListType in allArmyListTypes"
                :key="armyListType.id"
                :value="armyListType.id"
            >
                {{ armyListType.display_name }} - {{armyListType.max_points}} Points
            </option>
            <option :value="null">Custom</option>
        </select>
        <InputError class="mt-2" :message="errors?.army_list_type_id" />
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
            v-model.number="customMaxPoints"
        />
        <InputError class="mt-2" :message="errors?.custom_max_points" />
    </div>
</template>
