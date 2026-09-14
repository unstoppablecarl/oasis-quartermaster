<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { BModal, type BvTriggerableEvent } from 'bootstrap-vue-next'
import { ref } from 'vue'
import ArmyListController from '@/actions/App/Http/Controllers/ArmyListController'
import type { ArmyList } from '@/types/army-list'

defineOptions({ inheritAttrs: false })

const { armyList } = defineProps<{
    armyList: ArmyList;
}>()

const visible = ref(false)
const processing = ref(false)

function onOk(bvModalEvt: BvTriggerableEvent) {
    bvModalEvt.preventDefault()
    processing.value = true

    router.delete(ArmyListController.destroy.url(armyList.uuid), {
        preserveScroll: true,
        onSuccess: () => {
            visible.value = false
        },
        onFinish: () => {
            processing.value = false
        },
    })
}
</script>

<template>
    <button
        v-bind="$attrs"
        type="button"
        class="btn btn-sm btn-outline-danger"
        @click="visible = true"
    >
        Delete
    </button>

    <BModal
        v-model="visible"
        :title="`Delete “${armyList.display_name}”?`"
        ok-title="Delete"
        ok-variant="danger"
        cancel-title="Cancel"
        :ok-disabled="processing"
        @ok="onOk"
    >
        This will permanently delete this army list. This action cannot be
        undone.
    </BModal>
</template>
