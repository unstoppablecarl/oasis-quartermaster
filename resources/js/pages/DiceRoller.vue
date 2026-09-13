<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { nextTick, ref } from 'vue'
import Header from './DiceRoller/Header.vue'

const faces = new Array(8).fill(0).map((v, i) => i)

const diceToRoll = ref(3)
const diceResults = ref<number[]>([])
const isRolling = ref<(false | NodeJS.Timeout)[]>(new Array(8).fill(false))
const diceRefs = ref<HTMLElement[]>([])

function randomArrayValue<T>(array: T[], rng: () => number = Math.random): T {
    return array[Math.floor(rng() * array.length)]
}

function roll() {
    return randomArrayValue(faces) + 1
}

async function startRollingAnimation(index: number, result: number) {
    const existing = isRolling.value[index]

    if (existing) {
        clearTimeout(existing)
    }

    isRolling.value[index] = false
    diceResults.value[index] = 7

    await nextTick()

    const dieElement = diceRefs.value[index]

    if (dieElement) {
        void dieElement.offsetWidth
    }

    isRolling.value[index] = setTimeout(() => {
        isRolling.value[index] = false
        diceResults.value[index] = result
    }, 500)
}

function rollDice() {
    diceResults.value.length = 0

    for (let i = 0; i < diceToRoll.value; i++) {
        startRollingAnimation(i, roll())
    }
}

function reRoll(index: number) {
    startRollingAnimation(index, roll())
}

function decreaseCount() {
    if (diceToRoll.value > 1) {
        diceToRoll.value--
    }
}

function increaseCount() {
    if (diceToRoll.value < 6) {
        diceToRoll.value++
    }
}
</script>

<template>
    <div class="dr">
        <Head title="Dice Roller" />

        <Header />

        <div class="card">
            <div class="card-body">

                <div class="dr-panel-head">
                    <h4 class="dr-panel-title">Face Database</h4>
                    <span class="dr-panel-hint">Fixed — 8 / 8</span>
                </div>
                <div class="dr-faces-strip">
                    <div class="dr-face-chip" v-for="i in faces" :data-idx="'0' + (i + 1)">
                        <img :src="`/images/die-${i + 1}.png`" :alt="`Face ${i + 1}`" />
                    </div>
                </div>
            </div>
        </div>

        <br />

        <section class="card">
            <div class="card-body">

                <div class="dr-panel-head">
                    <h2 class="dr-panel-title">Dice Roller</h2>

                    <div class="d-flex">
                        <div class="dr-stepper">
                            <button type="button"
                                    @click="decreaseCount"
                                    class="dr-btn"
                                    aria-label="Decrease dice count"
                            >
                                −
                            </button>
                            <span class="dr-count-value">{{ diceToRoll }}</span>
                            <button type="button"
                                    @click="increaseCount"
                                    class="dr-btn"
                                    aria-label="Increase dice count">
                                +
                            </button>
                        </div>
                        <button class="dr-btn-roll ms-2" @click="rollDice">Roll</button>
                    </div>
                </div>
                <div class="dr-tray">
                    <div class="dr-dice-row">
                        <div class="dr-die-unit" v-for="(r, index) in diceResults">
                            <span class="dr-die-index">Unit 0{{ index + 1 }}</span>
                            <div
                                ref="diceRefs"
                                :class="{
                                    'dr-die': true,
                                    'dr-rolling': isRolling[index]
                                }"
                            >
                                <img
                                    :src="`/images/die-${r}.png`"
                                    :alt="`Die ${index + 1} result`">
                            </div>
                            <button
                                class="dr-btn"
                                type="button"
                                @click="reRoll(index)"
                            >
                                Reroll
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<style lang="scss">
.dr {
    --dr-void: #0A0A0A;
    --dr-plate: #141414;
    --dr-plate-raised: #1B1B1B;
    --dr-steel: #2A2A2A;
    --dr-line: #3A3A3A;
    --dr-line-bright: #525252;
    --dr-white: #D0CDBC;
    --dr-dim: #8F8F8B;
    --dr-dimmer: #5C5C58;
    --dr-led: #F2F2EF;
    --dr-shadow: rgba(0, 0, 0, 0.65);
    background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.018) 0px, rgba(255, 255, 255, 0.018) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at 50% -8%, rgba(255, 255, 255, 0.05) 0%, transparent 55%);

    .dr-panel-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--line);
    }

    .dr-panel-title {
        font-size: 13px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--ink);
        margin: 0;
        font-weight: bold;
    }

    .dr-faces-strip {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .dr-face-chip {
        width: 66px;
        height: 66px;
        border-radius: 3px;
        background: var(--dr-void);
        border: 1px solid var(--dr-line);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        img {
            width: 68%;
            height: 68%;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        &::before {
            content: attr(data-idx);
            position: absolute;
            top: 2px;
            left: 4px;
            font-size: 8px;
            color: var(--dr-dimmer);
            letter-spacing: 0.05em;
        }
    }

    .dr-panel-hint {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--dr-dimmer);
    }

    .dr-hazard-rule {
        height: 6px;
        max-width: 260px;
        margin: 22px auto 0;
        background: repeating-linear-gradient(135deg, var(--dr-white) 0 10px, var(--dr-void) 10px 20px);
        opacity: 0.85;
    }

    .dr-tray {
        background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.015) 0 2px, transparent 2px 8px), var(--dr-void);
        border-radius: 4px;
        border: 1px solid var(--dr-line);
        padding: 30px 20px;
        min-height: 170px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: repeating-linear-gradient(135deg, var(--dr-white) 0 8px, transparent 8px 16px);
            opacity: 0.5;
        }
    }

    .dr-dice-row {
        display: flex;
        flex-wrap: wrap;
        gap: 28px;
        justify-content: center;
        width: 100%;
    }

    .dr-die-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 126px;

        img {
            width: 78%;
            height: 78%;
            object-fit: contain;
            filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.6));
        }
    }

    .dr-die-index {
        font-family: var(--body-font);
        font-size: 10px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--dr-dimmer);
    }

    .dr-die {
        width: 108px;
        height: 108px;
        border-radius: 3px;
        background: var(--dr-plate);
        border: 1px solid var(--dr-line-bright);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background-image: radial-gradient(circle 2px at 10px 10px, var(--dr-line-bright) 95%, transparent 100%), radial-gradient(circle 2px at calc(100% - 10px) 10px, var(--dr-line-bright) 95%, transparent 100%), radial-gradient(circle 2px at 10px calc(100% - 10px), var(--dr-line-bright) 95%, transparent 100%), radial-gradient(circle 2px at calc(100% - 10px) calc(100% - 10px), var(--dr-line-bright) 95%, transparent 100%), var(--dr-plate);
    }

    .dr-btn {
        font-family: var(--title-font);
        font-weight: bold;
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--dr-white);
        background: var(--dr-steel);
        border: 1px solid var(--dr-line-bright);
        padding: 7px 14px;
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;

        &:hover {
            background: var(--dr-white);
            color: var(--dr-void);
            border-color: var(--dr-white);
        }
    }

    .dr-count-value {
        font-family: var(--title-font);
        font-weight: 700;
        font-size: 24px;
        color: var(--dr-white);
        min-width: 26px;
        text-align: center;
    }

    .dr-stepper {
        display: flex;
        align-items: center;
        gap: 18px;
        background: var(--dr-void);
        border-radius: 3px;
        padding: 8px 10px;
        border: 1px solid var(--dr-line);
    }

    .dr-btn-roll {
        font-family: var(--title-font);
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--dr-void);
        background: var(--dr-white);
        border: none;
        padding: 15px 46px;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.12s ease, background 0.12s ease;
    }

    @keyframes dr-die-animation {
        0% {
            transform: rotate(0deg) scale(1);
            filter: brightness(1) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.6));
        }
        20% {
            transform: rotate(-22deg) scale(0.88);
            filter: brightness(0.7) drop-shadow(0 5px 6px rgba(0, 0, 0, 0.5));
        }
        45% {
            transform: rotate(16deg) scale(1.08);
            filter: brightness(1.25) drop-shadow(0 12px 14px rgba(0, 0, 0, 0.65));
        }
        70% {
            transform: rotate(-10deg) scale(0.95);
            filter: brightness(0.85) drop-shadow(0 6px 8px rgba(0, 0, 0, 0.55));
        }
        100% {
            transform: rotate(0deg) scale(1);
            filter: brightness(1) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.6));
        }
    }

    .dr-rolling img {
        animation: dr-die-animation 0.5s ease-in-out;
    }
}

</style>
