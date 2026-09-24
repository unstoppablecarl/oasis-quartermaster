<script setup lang="ts">
const { messages, factionMessages, headingClass = 'text-danger fw-bold', textClass } = defineProps<{
    messages?: string[]
    factionMessages?: string[]
    headingClass?: string
    textClass?: string
}>()

</script>
<template>
    <template v-if="messages?.length">
        <div :class="headingClass">
            <template v-if="messages.length > 1">
                Rules Violations
            </template>
            <template v-else>
                Rules Violation
            </template>
        </div>
        <div :class="textClass">

            <ul v-if="messages.length > 1">
                <li v-for="item in messages">
                    {{ item }}
                </li>
            </ul>
            <template v-else>{{ messages[0] }}</template>
        </div>
    </template>
    <template v-if="factionMessages?.length">
        <div :class="headingClass">
            <template v-if="factionMessages.length > 1">
                Faction Violations
            </template>
            <template v-else>
                Faction Violation
            </template>
        </div>
        <div :class="textClass">
            <ul v-if="factionMessages.length > 1">
                <li v-for="item in factionMessages">
                    {{ item }}
                </li>
            </ul>
            <template v-else>{{ factionMessages[0] }}</template>
        </div>
    </template>
</template>
