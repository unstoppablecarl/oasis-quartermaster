import path from 'node:path'
import type { Plugin } from 'vite'

const mainEntryPath = path.resolve(import.meta.dirname, '../main.ts')

/**
 * vuedraggable only ships a UMD build whose `require("vue")` would otherwise
 * resolve to a second, full (compiler-included) copy of Vue.
 */
export function vuedraggableSharedVuePlugin(): Plugin {
    return {
        name: 'oasis:vuedraggable-shared-vue',
        enforce: 'pre',
        resolveId(id, importer) {
            if (id === 'vue' && importer?.includes('/vuedraggable/')) {
                return this.resolve('vue', mainEntryPath, { skipSelf: true })
            }
        },
    }
}
