<script setup lang="ts">
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { BModal } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import type { FactionId } from '../../../data/factions'
import { FACTIONS_BY_ID } from '../../lib/static-data-helpers'

const { factionId } = defineProps<{
    factionId: FactionId
}>()

const faction = computed(() => FACTIONS_BY_ID[factionId])

const visible = ref(false)
</script>
<template>
    <button
        role="button"
        class="btn btn-outline-info btn-sm"
        @click="visible = true"
    >
        <PhMagnifyingGlass />
    </button>

    <BModal
        v-model="visible"
        title="Faction Card"
        :hide-footer="true"
        no-footer
    >
        <div class="text-center">
            <img
                v-if="faction.card"
                :src="`/images/cards/factions/${faction.card}`"
                :alt="`${faction.display_name} Faction Card`"
                width="400"
            />
        </div>
    </BModal>
</template>
