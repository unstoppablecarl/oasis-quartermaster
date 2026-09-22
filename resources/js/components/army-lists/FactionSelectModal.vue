<script setup lang="ts">
import { BModal } from 'bootstrap-vue-next'
import { ref } from 'vue'
import type { FactionId } from '../../../data/factions'
import { FACTIONS } from '../../../data/factions'

defineOptions({ inheritAttrs: false })

const factionId = defineModel<FactionId>({ required: true })

const allFactions = Object.values(FACTIONS)
const visible = ref(false)

function select(id: FactionId) {
    factionId.value = id
    visible.value = false
}
</script>

<template>
    <button
        v-bind="$attrs"
        type="button"
        class="btn btn-primary btn-sm"
        @click="visible = true"
    >
        Change
    </button>

    <BModal
        v-model="visible"
        title="Select Faction"
        :hide-footer="true"
        no-footer
        size="xl"
    >
        <div class="row">
            <div
                class="col-3"
                v-for="faction in allFactions"
                :key="faction.id"
            >
                <button
                    type="button"
                    class="btn btn-primary"
                    :class="{ active: faction.id === factionId }"
                    @click="select(faction.id)"
                >
                    <img v-if="faction.card" :src="`/images/cards/factions/${faction.card}`" class="w-100" :alt="`${faction.display_name} Faction Card`" />
                    <template v-else>
                        {{ faction.display_name }}
                    </template>
                    Select
                </button>
            </div>
        </div>
    </BModal>
</template>
