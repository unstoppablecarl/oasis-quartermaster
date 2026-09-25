<script setup lang="ts">
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { BModal } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { type FactionId } from '../../../data/factions'
import { FACTIONS_BY_ID } from '../../lib/static-data-helpers'
import FactionCard from '../ui/FactionCard.vue'

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
            <FactionCard
                :card-image="faction.card_front"
                side="Front"
                :display-name="faction.display_name"
                width="400"
            />
        </div>
    </BModal>
</template>
