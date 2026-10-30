<script setup lang="ts">
import { BModal } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import type { FactionId } from '../../../data/factions'
import { FACTIONS } from '../../../data/factions'
import { CARD_DEFAULT_WIDTH, FACTIONS_BY_ID } from '../../lib/static-data-helpers'
import FactionCard from '../ui/FactionCard.vue'

const factionId = defineModel<FactionId>({ required: true })

const allFactions = computed(() => {
    return Object.values(FACTIONS).map((f) => {
        return {
            ...f,
            card_front: 'card_front' in f ? f.card_front : undefined,
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
    <div class="btn-group d-flex">
        <button
            role="button"
            class="btn btn-outline-secondary flex-grow-1 btn-outline-hover"
            @click="visible = true"
        >
            {{ faction.display_name }}
        </button>
        <button
            type="button"
            class="btn btn-primary flex-grow-0"
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
        size="fluid"
    >
        <div class="d-flex flex-wrap justify-content-center">
            <div
                class="mx-2 my-2 modal-card-choice"
                v-for="faction in allFactions"
                :key="faction.id"
            >
                <div
                    class="border cursor-pointer"
                    :class="{
                        'border-danger': faction.selected,
                        'border-primary': !faction.selected,
                    }"
                    @click="select(faction.id)"
                >
                    <FactionCard
                        v-if="faction.card_front"
                        :card-image="faction.card_front"
                        :display-name="faction.display_name"
                        side="Front"
                    />
                    <div
                        v-else
                        class="d-flex align-items-center justify-content-center text-center p-3 fs-5 modal-card-choice-placeholder"
                        :style="{
                            width: `${CARD_DEFAULT_WIDTH}px`,
                            aspectRatio: '1241 / 2126',
                        }"
                    >
                        {{ faction.display_name }}
                    </div>
                </div>
                <button
                    type="button"
                    class="btn p-1 w-100 btn-card-choice"
                    :class="{
                        'btn-danger': faction.selected,
                        'btn-primary': !faction.selected,
                    }"
                    @click="select(faction.id)"
                >
                    <template v-if="faction.selected"> Current </template>
                    <template v-else> Select </template>
                </button>
            </div>
        </div>
    </BModal>
</template>
