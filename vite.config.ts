import path from 'node:path'
import inertia from '@inertiajs/vite'
import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import { google } from 'laravel-vite-plugin/fonts'
import { defineConfig, lazyPlugins } from 'vite-plus'
import { staticDataPlugin } from './resources/js/lib/vite-static-data-plugin'

const scssVariablesPath = path.resolve(
    import.meta.dirname,
    'resources/styles/variables',
)

export default defineConfig({
    plugins: lazyPlugins(() => [
        staticDataPlugin(),
        laravel({
            input: ['resources/styles/main.scss', 'resources/js/main.ts'],
            refresh: true,
            fonts: [google('Oswald', {})],
        }),
        inertia(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
    ]),
    server: {
        watch: {
            ignored: [
                '**/.agents/**',
                '**/.claude/**',
                '**/.cursor/**',
                '**/.junie/**',
                '**/vendor/**',
            ],
        },
    },
    lint: {
        ignorePatterns: [
            'vendor/**',
            'node_modules/**',
            'public/**',
            'bootstrap/ssr/**',
            'resources/js/actions/**',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
            'resources/static-data/**',
        ],
        options: {
            denyWarnings: true,
            typeAware: true,
        },
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        semi: false,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        ignorePatterns: [
            '.github/**',
            'composer.json',
            'resources/views/mail/*',
        ],
    },
    css: {
        preprocessorOptions: {
            scss: {
                // makes shared Sass variables (colors, spacing, etc.) available
                // in every <style lang="scss"> block without a manual @import
                additionalData: `@import "${scssVariablesPath}";`,
                // bootstrap still uses deprecated but supported sass features
                silenceDeprecations: [
                    'color-functions',
                    'global-builtin',
                    'import',
                    'if-function',
                ],
            },
        },
    },
})
