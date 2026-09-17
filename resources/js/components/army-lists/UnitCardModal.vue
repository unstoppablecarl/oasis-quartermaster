<script setup lang="ts">
import { Search } from '@lucide/vue'
import { BModal } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { UNITS_BY_ID } from '../../../data/units'

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
        <h5>Front</h5>
        <p>

            <img v-for="cardFront in unitInfo.cards_front" :src="`/images/cards/units/${cardFront}`"
                 :alt="`${unitInfo.display_name} card front`" width="50%" />
        </p>
        <h5>Back</h5>
        <img :src="`/images/cards/units/${unitInfo.card_back}`" :alt="`${unitInfo.display_name} card back`"
             width="50%" />
    </BModal>
</template>
