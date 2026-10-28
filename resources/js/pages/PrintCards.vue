<script setup lang="ts">
import { Head, setLayoutProps } from '@inertiajs/vue3'
import { PhPrinter } from '@phosphor-icons/vue'
import { BFormCheckbox } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { COMMANDS } from '../../data/commands'
import { FACTIONS } from '../../data/factions'
import { UNITS } from '../../data/units'
import AppFooter from '../components/AppFooter.vue'
import {
    type Card,
    getCommandCards,
    getFactionCards,
    getUnitCards,
} from '../composables/useArmyList'
import { chunk } from '../lib/utils'
import ArmyListItemHeader from './ArmyLists/Components/ArmyListItemHeader.vue'
import PrintCardPages from './ArmyLists/Components/PrintCardPages.vue'
import PrintSettings from './ArmyLists/Print/PrintSettings.vue'

setLayoutProps({
    showFooter: false,
    printLayout: true,
})

const cardsPerPage = 4

const printCardsInColor = ref(true)
const printPageNumbers = ref(true)
const printUnitCards = ref(true)
const printUnitCardBacks = ref(true)
const printEachUnitOnSeparatePage = ref(true)
const printFactionCards = ref(true)
const printCommandCards = ref(true)
const printCommandCardBacks = ref(true)

function frontsOnly(cards: Card[]): Card[] {
    return cards.filter((card) => card.side === 'Front')
}

function unitCardsFor(units: Parameters<typeof getUnitCards>[0]): Card[] {
    const cards = getUnitCards(units)

    return printUnitCardBacks.value ? cards : frontsOnly(cards)
}

const factionCards = computed(() => {
    if (!printFactionCards.value) {
        return []
    }

    return Object.values(FACTIONS).flatMap((faction) =>
        getFactionCards(faction.id),
    )
})

const commandCards = computed(() => {
    if (!printCommandCards.value) {
        return []
    }

    const cards = getCommandCards(Object.values(COMMANDS))

    return printCommandCardBacks.value ? cards : frontsOnly(cards)
})

const pages = computed(() => {
    const units = printUnitCards.value ? Object.values(UNITS) : []
    const otherCards = [...factionCards.value, ...commandCards.value]

    if (!printEachUnitOnSeparatePage.value) {
        return chunk([...unitCardsFor(units), ...otherCards], cardsPerPage)
    }

    return [
        ...units.flatMap((unit) =>
            chunk(unitCardsFor([unit]), cardsPerPage),
        ),
        ...chunk(otherCards, cardsPerPage),
    ]
})

function print() {
    window.print()
}
</script>
<template>
    <div>
        <Head title="Print All Cards" />

        <ArmyListItemHeader title="Print All Cards" />

        <PrintSettings>
            <template #body>
                <div class="mb-1">
                    <div class="fw-bold mt-1 mb-2">Card Settings</div>

                    <BFormCheckbox
                        v-model="printCardsInColor"
                        id="print_cards_in_color"
                        :unchecked-value="false"
                    >
                        Print Cards in Color
                    </BFormCheckbox>
                    <BFormCheckbox
                        v-model="printPageNumbers"
                        id="print_page_numbers"
                        :unchecked-value="false"
                    >
                        Print Page Numbers
                    </BFormCheckbox>

                    <div class="fw-bold mt-3 mb-2">Unit Cards</div>
                    <BFormCheckbox
                        v-model="printUnitCards"
                        id="print_unit_cards"
                        :unchecked-value="false"
                    >
                        Print Unit Cards
                    </BFormCheckbox>
                    <BFormCheckbox
                        v-model="printUnitCardBacks"
                        id="print_unit_card_backs"
                        :unchecked-value="false"
                        :disabled="!printUnitCards"
                    >
                        Print Unit Card Backs
                    </BFormCheckbox>
                    <BFormCheckbox
                        v-model="printEachUnitOnSeparatePage"
                        id="print_each_unit_on_separate_page"
                        :unchecked-value="false"
                        :disabled="!printUnitCards"
                    >
                        Print Each Unit on a Separate Page
                    </BFormCheckbox>

                    <div class="fw-bold mt-3 mb-2">Faction Cards</div>
                    <BFormCheckbox
                        v-model="printFactionCards"
                        id="print_faction_cards"
                        :unchecked-value="false"
                    >
                        Print Faction Cards
                    </BFormCheckbox>

                    <div class="fw-bold mt-3 mb-2">Command Cards</div>
                    <BFormCheckbox
                        v-model="printCommandCards"
                        id="print_command_cards"
                        :unchecked-value="false"
                    >
                        Print Command Cards
                    </BFormCheckbox>
                    <BFormCheckbox
                        v-model="printCommandCardBacks"
                        id="print_command_card_backs"
                        :unchecked-value="false"
                        :disabled="!printCommandCards"
                    >
                        Print Command Card Backs
                    </BFormCheckbox>
                </div>
            </template>
            <template #footer>
                <button
                    role="button"
                    class="btn btn-primary btn-sm me-4"
                    :disabled="!pages.length"
                    @click="print"
                >
                    Print All Cards ({{ pages.length }} pages)
                    <PhPrinter size="16" />
                </button>
            </template>
        </PrintSettings>

        <Teleport to="#after-app-teleport" defer>
            <div class="page-previews-container" data-bs-theme="light">
                <div class="output-container">
                    <PrintCardPages
                        :pages="pages"
                        :print-cards-in-color="printCardsInColor"
                        :show-page-numbers="printPageNumbers"
                    />
                </div>
            </div>
            <AppFooter class="no-print" />
        </Teleport>
    </div>
</template>
