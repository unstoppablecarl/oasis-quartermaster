<script setup lang="ts">
import { Link, setLayoutProps } from '@inertiajs/vue3'
import { PhPrinter } from '@phosphor-icons/vue'
import { BFormCheckbox } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import AppFooter from '../../../components/AppFooter.vue'
import { useCurrentUrl } from '../../../composables/useCurrentUrl'
import { injectArmyList } from '../../../composables/useArmyList'
import { print as printRoute } from '../../../routes/army-lists'
import { print as draftPrintRoute } from '../../../routes/army-lists/draft'
import PrintFactionAndCommandCards from '../Print/PrintFactionAndCommandCards.vue'
import PrintSettings from '../Print/PrintSettings.vue'
import PrintUnitCards from '../Print/PrintUnitCards.vue'
import PrintUnitList from '../Print/PrintUnitList.vue'

const { printMode } = defineProps<{
    printMode: string
}>()

const { armyList } = injectArmyList()

setLayoutProps({
    showFooter: false,
    printLayout: true,
})

function print() {
    window.print()
}

const PRINT_MODE_UNIT_CARDS = 'cards'
const PRINT_MODE_LIST = 'list'
const PRINT_MODE_FACTION_AND_COMMAND_CARDS = 'faction-and-command-cards'

const PRINT_MODES: Record<string, { display_name: string }> = {
    [PRINT_MODE_LIST]: {
        display_name: 'Army List',
    },
    [PRINT_MODE_UNIT_CARDS]: {
        display_name: 'Unit Cards',
    },
    [PRINT_MODE_FACTION_AND_COMMAND_CARDS]: {
        display_name: 'Faction + Command Cards',
    },
}

const printModeDisplayName = computed(() => PRINT_MODES[printMode].display_name)

function printModeHref(mode: string) {
    const routeMode = mode === PRINT_MODE_LIST ? undefined : mode

    return armyList.uuid
        ? printRoute({ army_list: armyList.uuid, mode: routeMode })
        : draftPrintRoute(routeMode)
}

const { isCurrentUrl } = useCurrentUrl()

const printCardsInColor = ref(true)
const printCardBacks = ref(true)
const printFactionCard = ref(true)
const printCommandCards = ref(true)
</script>
<template>
    <PrintSettings>
        <template #nav>
            <template v-for="(item, key) in PRINT_MODES" :key="key">
                <Link
                    :href="printModeHref(key)"
                    preserve-scroll
                    :class="{
                        'btn btn-sm btn-default': true,
                        active: isCurrentUrl(printModeHref(key)),
                    }"
                >
                    {{ item.display_name }}
                </Link>
            </template>
        </template>

        <template #body>
            <div class="mb-1">
                <template
                    v-if="
                        printMode === PRINT_MODE_FACTION_AND_COMMAND_CARDS ||
                        printMode === PRINT_MODE_UNIT_CARDS
                    "
                >
                    <div class="fw-bold mt-1 mb-2">Card Settings</div>

                    <BFormCheckbox
                        v-model="printCardsInColor"
                        id="print_cards_in_color"
                        :unchecked-value="false"
                    >
                        Print Cards in Color
                    </BFormCheckbox>
                    <BFormCheckbox
                        v-model="printCardBacks"
                        id="print_card_backs"
                        :unchecked-value="false"
                    >
                        Print Card Backs
                    </BFormCheckbox>
                </template>
                <template
                    v-if="printMode === PRINT_MODE_FACTION_AND_COMMAND_CARDS"
                >
                    <div class="fw-bold mt-1 mb-2">
                        Faction + Command Card Settings
                    </div>
                    <BFormCheckbox
                        v-model="printFactionCard"
                        id="print_faction_card"
                        :unchecked-value="false"
                    >
                        Print Faction Card
                    </BFormCheckbox>
                    <BFormCheckbox
                        v-model="printCommandCards"
                        id="print_command_cards"
                        :unchecked-value="false"
                    >
                        Print Command Cards
                    </BFormCheckbox>
                </template>
            </div>
        </template>
        <template #footer>
            <button
                role="button"
                class="btn btn-primary btn-sm me-4"
                @click="print"
            >
                {{ printModeDisplayName }}
                <PhPrinter size="16" />
            </button>
        </template>
    </PrintSettings>

    <Teleport to="#after-app-teleport" defer>
        <div class="page-previews-container" data-bs-theme="light">
            <div class="output-container">
                <PrintUnitCards
                    v-if="printMode === PRINT_MODE_UNIT_CARDS"
                    :print-card-backs="printCardBacks"
                    :print-cards-in-color="printCardsInColor"
                />

                <PrintUnitList v-if="printMode === PRINT_MODE_LIST" />

                <PrintFactionAndCommandCards
                    v-if="printMode === PRINT_MODE_FACTION_AND_COMMAND_CARDS"
                    :print-card-backs="printCardBacks"
                    :print-cards-in-color="printCardsInColor"
                    :print-faction-card="printFactionCard"
                    :print-command-cards="printCommandCards"
                />
            </div>
        </div>
        <AppFooter class="no-print" />
    </Teleport>
</template>
