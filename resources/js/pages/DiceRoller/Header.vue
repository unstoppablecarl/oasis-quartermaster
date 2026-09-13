<script setup lang="ts">

</script>
<template>
    <div class="dr-header">
        <p class="dr-id-tag"><span class="dr-dot"></span>UNIT-08 /// SALVAGE SUCCESS SIMULATION SYSTEM</p>
        <div class="dr-hazard-rule"></div>
    </div>
</template>
<style lang="scss">
.dr-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--dr-led);
    box-shadow: 0 0 8px 1px rgba(208, 205, 188, 0.7);
    animation: dr-blink 2.4s ease-in-out infinite;
}

@keyframes dr-blink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.25;
    }
}

.dr-id-tag {
    font-family: var(--body-font);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--dr-dim);
    margin: 0 0 18px;
    font-weight: 600;
}

.dr-header {
    text-align: center;
    margin-bottom: 32px;
    position: relative;
}
</style>
