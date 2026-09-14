<script setup lang="ts">
import DeleteArmyListModal from '@/components/army-lists/DeleteArmyListModal.vue'
import Heading from '@/components/Heading.vue'
import { edit, show } from '@/routes/army-lists'
import type { ArmyList } from '@/types/army-list'
import { Head, Link } from '@inertiajs/vue3'

const props = defineProps<{
    armyLists: ArmyList[];
}>()
</script>
<template>
    <Head title="Army Lists" />
    <Heading variant="small" title="Army Lists" />

    <table class="table align-middle border-top">
        <tbody>
        <tr v-if="props.armyLists.length === 0">
            <td colspan="2" class="text-secondary text-center">
                No army lists yet.
            </td>
        </tr>
        <tr v-for="item in props.armyLists" :key="item.uuid">
            <td class="fw-medium">
                {{ item.display_name }}
            </td>
            <td class="text-end">
                <div class="d-flex justify-content-end gap-2">
                    <div class="btn-group">

                        <Link
                            :href="show(item.uuid)"
                            class="btn btn-sm btn-outline-secondary"
                        >View
                        </Link
                        >
                        <Link
                            v-if="item.can.update"
                            :href="edit(item.uuid)"
                            class="btn btn-sm btn-outline-secondary"
                        >Edit
                        </Link
                        >
                    </div>
                    <DeleteArmyListModal
                        v-if="item.can.delete"
                        :army-list="item"
                    />
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>
