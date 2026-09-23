<script setup lang="ts">
import { BModal } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import { type CommandId, COMMANDS } from '../../../data/commands'
import { COMMANDS_BY_ID } from '../../lib/static-data-helpers'

const commandIds = defineModel<CommandId[]>({ required: true })

const allCommands = computed(() => {
    return Object.values(COMMANDS).map((f) => {
        const selected = commandIds.value.includes(f.id)

        return {
            ...f,
            selected,
            disabled: !selected && commands.value.length >= 2,
        }
    })
})

const commands = computed(() => commandIds.value.map(id => COMMANDS_BY_ID[id].display_name))
const visible = ref(false)

function select(id: CommandId) {
    if (commandIds.value.includes(id)) {
        commandIds.value = commandIds.value.filter((cId) => cId !== id)
        return
    }

    if (commandIds.value.length >= 2) {
        return
    }

    commandIds.value = [...commandIds.value, id].sort((a, b) => a - b)
}
</script>

<template>
    <div class="btn-group d-flex">
        <button role="button" class="btn btn-outline-secondary disabled flex-grow-1">
            {{ commands.join(', ') }}
            <template v-if="commands.length === 0">None Selected</template>
        </button>
        <button
            type="button"
            class="btn btn-primary flex-grow-0"
            @click="visible = true"
        >
            Change
        </button>
    </div>
    <div v-if="commands.length < 2" class="ms-2 mt-1 text-danger-emphasis"> ({{ commands.length }}/2 Selected)</div>

    <BModal
        v-model="visible"
        size="fluid"
    >
        <template #title>Select Commands ({{ commands.length }}/2)</template>
        <template #cancel>&nbsp;</template>
        <div class="row">
            <div
                class="col-3 mb-2"
                v-for="command in allCommands"
                :key="command.id"
            >

                <div
                    v-if="command.card"
                    class="border"
                    :class="{
                        'border-danger': command.selected,
                        'border-primary': !command.selected,
                        'cursor-pointer': !command.disabled,
                        'border-disabled': command.disabled,
                    }"
                    @click="select(command.id)"
                >
                    <img
                        :src="`/images/cards/commands/${command.card}`"
                        class="w-100"
                        :alt="`${command.display_name} Faction Card`"
                    />
                </div>
                <template v-else>
                    {{ command.display_name }}
                </template>
                <button
                    type="button"
                    class="btn p-1 w-100 btn-command"
                    :class="{
                        'btn-danger': command.selected,
                        'btn-primary': !command.selected
                    }"
                    :disabled="command.disabled"
                    @click="select(command.id)"
                >
                    <template v-if="command.selected">
                        Remove
                    </template>
                    <template v-else>
                        Add
                    </template>
                </button>
            </div>
        </div>
    </BModal>
</template>
<style lang="scss">
.btn-command {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.border-disabled {
    --bs-border-opacity: #{$btn-disabled-opacity};
}
</style>
