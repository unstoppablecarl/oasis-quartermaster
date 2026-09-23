<script setup lang="ts">
import { PhCheck, PhX } from '@phosphor-icons/vue'
import { BFormCheckbox } from 'bootstrap-vue-next'
import { computed, watch } from 'vue'
import { ARMY_LIST_TYPES } from '../../../../data/army-list-types'
import type { CommandId } from '../../../../data/commands'
import CommandSelectModal from '../../../components/army-lists/CommandSelectModal.vue'
import FactionSelectModal from '../../../components/army-lists/FactionSelectModal.vue'
import InputError from '../../../components/InputError.vue'
import type { LocalArmyList } from '../../../composables/useUnitsInfo'
import BtnCopyLink from './BtnCopyLink.vue'
import ButtonToggle from './ButtonToggle.vue'

const { armyList, errors, isCreating = false } = defineProps<{
    armyList: Pick<
        LocalArmyList,
        'display_name' | 'army_list_type_id' | 'custom_max_points' | 'public' | 'uuid' | 'faction_id' | 'commands'
    >
    errors?: Partial<
        Record<
            'display_name' | 'army_list_type_id' | 'custom_max_points' | 'public' | 'commands',
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

const commands = computed({
    get() {
        return armyList.commands.map(c => c.id)
    },
    set(value: CommandId[]) {
        armyList.commands = value.map(v => {
            return {
                id: v,
            }
        })
    },
})
</script>
<template>
    <div class="row mb-3">
        <div class="col-md-4 col-sm-6 mb-2">
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

        <div class="col-md-4 col-sm-6 mb-2">
            <label for="army_list_type_id" class="form-label title-font">
                Game Mode
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
                    {{ armyListType.display_name }}:
                    {{ armyListType.max_points }} Points
                </option>
                <option :value="null">Custom</option>
            </select>
            <InputError class="mt-2" :message="errors?.army_list_type_id" />
        </div>

        <div class="col-md-4 col-sm-6 mb-2" :class="{'lg-invisible': !isCustomArmyListType}">
            <label for="custom_max_points" class="form-label title-font">
                Max Points
            </label>
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

        <div class="col-md-4 col-sm-6 mb-2">
            <label class="form-label title-font d-block">Faction</label>
            <FactionSelectModal v-model="armyList.faction_id" />
        </div>
        <div class="col-md-4 col-sm-6 mb-2">
            <label class="form-label title-font d-block">Commands</label>
            <CommandSelectModal v-model="commands" />
            <InputError class="mt-2" :message="errors?.commands" />
        </div>

        <div class="col-md-4 col-sm-6 mb-2" v-if="!isCreating">
            <label for="army_list_type_id" class="form-label title-font">
                Visibility
            </label>
            <div>
                <BFormCheckbox
                    id="public"
                    v-model="armyList.public"
                    name="public"
                    :value="1"
                    :unchecked-value="0"
                    class="d-inline-block"
                    :button-variant="armyList.public ? 'success' : 'danger'"
                    button
                >
                    <PhCheck v-if="armyList.public" />
                    <PhX v-else />
                    &nbsp;
                    Publicly Visible
                </BFormCheckbox>

                <BtnCopyLink
                    v-if="armyList.uuid && armyList.public"
                    :army-list-uuid="armyList.uuid"
                    class="ms-2"
                />
            </div>
            <InputError class="mt-2" :message="errors?.public" />
        </div>
    </div>
</template>
<style lang="scss">

</style>
