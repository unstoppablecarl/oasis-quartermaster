<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3'
import { PhPrinter } from '@phosphor-icons/vue'
import { BFormCheckbox } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import AppFooter from '../../components/AppFooter.vue'
import ArmyListItemLayout from '../../layouts/army-lists/ArmyListItemLayout.vue'
import type { ArmyList } from '../../types/army-list'
import ArmyListInfoSummary from './ArmyListInfoSummary.vue'
import ArmyListValidationSummary from './Components/ArmyListValidationSummary.vue'
import PrintSettings from './Print/PrintSettings.vue'
import PrintUnitCards from './Print/PrintUnitCards.vue'
import PrintUnitList from './Print/PrintUnitList.vue'

const { armyList } = defineProps<{
    armyList: ArmyList
}>()

setLayoutProps({
    showFooter: false,
    printMode: true,
})

function print() {
    window.print()
}

const PRINT_MODE_CARDS = 'PRINT_MODE_CARDS'
const PRINT_MODE_LIST = 'PRINT_MODE_LIST'
const PRINT_MODES: Record<string, { display_name: string }> = {
    [PRINT_MODE_CARDS]: {
        display_name: 'Unit Cards',
    },
    [PRINT_MODE_LIST]: {
        display_name: 'Unit List',
    },
}
const printMode = ref(PRINT_MODE_CARDS)
const printModeDisplayName = computed(() => PRINT_MODES[printMode.value].display_name)

const printCardsInColor = ref(true)

</script>
<template>
    <ArmyListItemLayout title="Print" :army-list="armyList">
        <Head title="Print" />

        <div class="print-settings-container m-auto">
            <ArmyListInfoSummary :army-list="armyList" />
            <ArmyListValidationSummary :army-list="armyList" heading-class="text-teal" />
        </div>
        <PrintSettings>
            <template #nav>
                <template v-for="(item, key) in PRINT_MODES">
                    <button
                        :class="{
                        'btn btn-sm btn-default': true,
                        'active': printMode === key
                      }"
                        @click="printMode = key"
                    >
                        {{ item.display_name }}
                    </button>
                </template>
            </template>

            <template #body>

                <div class="mb-1">
                    <div class="fw-bold mt-1 mb-2">
                        Card Settings
                    </div>

                    <BFormCheckbox
                        v-model="printCardsInColor"
                        id="print_cards_in_color"
                    >
                        Print Cards in Color
                    </BFormCheckbox>
                </div>

            </template>
            <template #footer>
                <button role="button" class="btn btn-primary btn-sm me-4" @click="print">
                    {{ printModeDisplayName }}
                    <PhPrinter size="16" />
                </button>
            </template>
        </PrintSettings>
    </ArmyListItemLayout>

    <Teleport to="#after-app-teleport" defer>
        <div class="page-previews-container" data-bs-theme="light">
            <div class="output-container">
                <PrintUnitCards
                    v-if="printMode === PRINT_MODE_CARDS"
                    :army-list="armyList"
                />

                <PrintUnitList
                    v-if="printMode === PRINT_MODE_LIST"
                    :army-list="armyList"
                />
            </div>
        </div>
        <AppFooter class="no-print" />
    </Teleport>
</template>
