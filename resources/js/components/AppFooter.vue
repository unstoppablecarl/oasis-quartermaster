<script setup lang="ts">
const { isPrintView = false, saveBarPadding = false } = defineProps<{
    isPrintView?: boolean
    saveBarPadding?: boolean
}>()
</script>
<template>
    <footer
        class="app-footer border-top mt-auto"
        :class="{
            'no-print': isPrintView,
            'app-footer-save-bar-padding': saveBarPadding,
        }"
    >
        <div class="container pt-3 text-center">
            <h5>Oasis Quartermaster</h5>
            <p>
                Created by
                <a href="https://github.com/unstoppablecarl">UnstoppableCarl</a>
            </p>
            <p>
                <a href="https://oasis-game.com/">Oasis Site</a>
                -
                <a href="https://www.collinsepicwargames.com/privacy.html"
                    >Privacy Policy</a
                >
                -
                <a href="https://collinsepicwargames.com/sitepolicy.html"
                    >Site Policy</a
                >
                -
                <a href="https://github.com/unstoppablecarl/oasis-quartermaster"
                    >Github Project</a
                >
            </p>

            <p class="text-secondary">
                Oasis Copyright © 2026 Collins Epic Wargames, LLC. All Rights
                Reserved.
            </p>
        </div>
    </footer>
</template>
