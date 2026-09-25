<script setup lang="ts">
import { Search } from '@lucide/vue'
import { BModal, vBTooltip } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'

import { UNITS_BY_ID } from '../../lib/static-data-helpers'
import UnitCard from '../ui/UnitCard.vue'

defineOptions({ inheritAttrs: false })

const { unitId } = defineProps<{
    unitId: number;
}>()

const unitInfo = computed(() => UNITS_BY_ID[unitId])
const visible = ref(false)

</script>
<template>
    <button
        v-bind="$attrs"
        role="button"
        class="btn btn-sm btn-outline-info ms-1"
        @click="visible = true"
        v-b-tooltip.hover.top
        title="View Card"
        v-if="unitInfo.cards_front.length"
    >
        <Search :strokeWidth="2.5" :size="16" />
    </button>

    <BModal
        v-model="visible"
        :title="`${unitInfo.display_name} Card${unitInfo.cards_front.length > 1 ? 's' : ''}`"
        size="xl"
        :hide-footer="true"
        no-footer
    >
        <div class="d-flex flex-wrap justify-content-center gap-2">
            <div>
                <h5>Front</h5>
                <p class="d-flex gap-2">
                    <UnitCard
                        v-for="cardFront in unitInfo.cards_front"
                        :card-image="cardFront"
                        :display-name="unitInfo.display_name"
                        type="Front"
                        width="400"
                    />
                </p>

            </div>
            <div>
                <h5>Back</h5>
                <p>
                    <UnitCard
                        :card-image="unitInfo.card_back"
                        :display-name="unitInfo.display_name"
                        type="Back"
                        width="400"
                    />
                </p>
            </div>
        </div>
    </BModal>
</template>
