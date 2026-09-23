<script setup lang="ts">
import { BModal } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import type { FactionId } from '../../../data/factions'
import { FACTIONS } from '../../../data/factions'
import { FACTIONS_BY_ID } from '../../lib/static-data-helpers'

const factionId = defineModel<FactionId>({ required: true })

const allFactions = computed(() => {
    return Object.values(FACTIONS).map((f) => {

        return {
            ...f,
            selected: f.id === factionId.value,
        }
    })
})

const faction = computed(() => FACTIONS_BY_ID[factionId.value])
const visible = ref(false)

function select(id: FactionId) {
    factionId.value = id
    visible.value = false
}
</script>

<template>
    <div class="btn-group btn-group-sm">
        <button role="button" class="btn btn-outline-secondary btn-sm disabled">
            {{ faction.display_name }}
        </button>
        <button

            type="button"
            class="btn btn-primary btn-sm"
            @click="visible = true"
        >
            Change
        </button>

    </div>

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
                    class="btn p-1 w-100 h-100"
                    :class="{
                        'btn-info': faction.selected,
                        'btn-primary': !faction.selected
                    }"
                    @click="select(faction.id)"
                >
                    <img
                        v-if="faction.card"
                        :src="`/images/cards/factions/${faction.card}`"
                        class="w-100"
                        :alt="`${faction.display_name} Faction Card`"
                    />
                    <template v-else>
                        {{ faction.display_name }}
                    </template>
                    <br>
                    <template v-if="faction.selected">
                        Current
                    </template>
                    <template v-else>
                        Select
                    </template>
                </button>
            </div>
        </div>
    </BModal>
</template>
