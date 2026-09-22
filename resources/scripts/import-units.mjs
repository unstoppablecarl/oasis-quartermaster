#!/usr/bin/env node

// Regenerates units.ts from master-unit-grid.csv. Re-run this any time the
// grid is updated: `npm run import:units`.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformWithOxc } from 'vite'

const dir = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(dir, '../data/master-unit-grid.csv')
const outPath = path.join(dir, '../data/units.ts')
const abilitiesPath = path.join(dir, '../data/abilities-and-traits.ts')

// abilities-and-traits.ts is TypeScript (regex matchers, etc.), so it's loaded the same
// way the Vite static-data plugin loads files from this directory: strip
// types with oxc, then import the result as a data: URL module.
async function loadAbilitiesModule(filePath) {
    const source = readFileSync(filePath, 'utf8')
    const { code } = await transformWithOxc(source, filePath)
    const dataUrl = `data:text/javascript,${encodeURIComponent(code)}`
    return import(dataUrl)
}

function validateAbilities(units, findAbilityOrTrait) {
    const unmatched = new Map()

    for (const unit of Object.values(units)) {
        const abilities = []
        const traits = []

        for (const raw of unit.abilities) {
            const match = findAbilityOrTrait(raw)

            if (!match) {
                if (!unmatched.has(raw)) {
                    unmatched.set(raw, new Set())
                }
                unmatched.get(raw).add(unit.display_name)
                continue
            }

            ;(match.type === 'trait' ? traits : abilities).push(raw)
        }

        unit.abilities = abilities
        unit.traits = traits
    }

    if (unmatched.size === 0) {
        return
    }

    const lines = [...unmatched.entries()]
        .map(([raw, unitNames]) => `  "${raw}" (${[...unitNames].join(', ')})`)
        .join('\n')
    throw new Error(
        `Found ${unmatched.size} ability/trait value(s) in the CSV that don't match anything in abilities.ts:\n${lines}`,
    )
}

// The grid has two header rows: a grouping row ("WEAPON 1", "WEAPON 2", ...)
// followed by the real column names. Several names repeat (RNG/ACC/DMG/KEY
// once per weapon, Ability/Trait once per ability slot), so columns are
// resolved by name + occurrence rather than by a fixed index, making the
// importer tolerant of the grid's columns being reordered.
const HEADER_ROW_INDEX = 1

function indexColumns(headerRow) {
    const positions = {}
    headerRow.forEach((name, index) => {
        const trimmed = name.trim()
        if (!trimmed) {
            return
        }
        ;(positions[trimmed] ??= []).push(index)
    })
    return positions
}

function columnIndex(positions, name, occurrence = 0) {
    const index = positions[name]?.[occurrence]
    if (index === undefined) {
        throw new Error(`CSV is missing expected column "${name}"${occurrence > 0 ? ` (occurrence ${occurrence + 1})` : ''}`)
    }
    return index
}

function resolveColumns(headerRow) {
    const positions = indexColumns(headerRow)

    const col = (name) => columnIndex(positions, name)

    return {
        COL: {
            QTY_IN_BASE_SET: col('Qty in Base Set'),
            NAME: col('Name'),
            CLASS_TYPE: col('Class'),
            MANUFACTURER: col('Manufacturer'),
            BASE_SIZE: col('Base Size'),
            BASE_QTY: col('Base Qty'),
            MODELS_PER_SQUAD: col('Models per Squad'),
            MODELS_PER_PACK: col('Models per Pack'),
            MAGNETS: col('Magnets'),
            FLIGHT_STAND_DIAMETER: col('Flight Stand'),
            FLIGHT_STAND_LENGTH: col('Stand Length'),
            FLIGHT_STAND_CONNECTOR: col('Flight Connector'),
            PTS: col('Pts'),
            INIT: col('Init'),
            DODGE: col('Dod'),
            DEFENSE: col('Def'),
            HP: col('HP'),
            SPEED: col('Speed'),
            CARDS_FRONT: col('Card File Names'),
        },
        WEAPON_COLS: (positions.RNG ?? []).map((_, i) => ({
            name: columnIndex(positions, 'NAME', i),
            range: columnIndex(positions, 'RNG', i),
            accuracy: columnIndex(positions, 'ACC', i),
            damage: columnIndex(positions, 'DMG', i),
            keywords: columnIndex(positions, 'KEY', i),
        })),
        ABILITY_COLS: positions['Ability'] ?? [],
        TRAIT_COLS: positions['Trait'] ?? [],
    }
}

function parseCsv(text) {
    const rows = []
    let row = []
    let field = ''
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
        const char = text[i]

        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                field += char
            }
            continue
        }

        if (char === '"') {
            inQuotes = true
        } else if (char === ',') {
            row.push(field)
            field = ''
        } else if (char === '\n' || char === '\r') {
            if (char === '\r' && text[i + 1] === '\n') {
                i++
            }
            row.push(field)
            rows.push(row)
            row = []
            field = ''
        } else {
            field += char
        }
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field)
        rows.push(row)
    }

    return rows
}

function str(value) {
    const trimmed = (value ?? '').trim()
    return trimmed === '' ? null : trimmed
}

function num(value) {
    const trimmed = (value ?? '').trim()
    if (trimmed === '' || trimmed === '?') {
        return null
    }
    const parsed = Number(trimmed)
    return Number.isNaN(parsed) ? null : parsed
}

function slugKey(name) {
    return name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
}

function parseWeapon(row, weaponCols) {
    const name = row[weaponCols.name]
    const range = row[weaponCols.range]
    const accuracy = row[weaponCols.accuracy]
    const damage = row[weaponCols.damage]
    const keywords = row[weaponCols.keywords]

    if (!str(range) && !str(accuracy) && !str(damage) && !str(keywords)) {
        return null
    }

    return {
        name: str(name) ?? 'unnamed',
        range: str(range) ?? '',
        accuracy: str(accuracy) ?? '',
        damage: str(damage) ?? '',
        keywords: str(keywords)?.split('/').map((k) => k.trim()).filter(Boolean) ?? [],
    }
}

function loadExistingIds(filePath) {
    if (!existsSync(filePath)) {
        return {}
    }

    const text = readFileSync(filePath, 'utf8')
    const ids = {}
    const pattern = /^ {4}(\w+): \{\n {8}id: (\d+),/gm

    let match
    while ((match = pattern.exec(text)) !== null) {
        ids[match[1]] = Number(match[2])
    }

    return ids
}

function parseUnit(row, id, columns) {
    const { COL, WEAPON_COLS, ABILITY_COLS, TRAIT_COLS } = columns
    let cardFrontRaw = str(row[COL.CARDS_FRONT])
    let cardsFront = []
    if (cardFrontRaw) {
        cardsFront = cardFrontRaw.split(',').map(s => s.trim())
    }

    return {
        id,
        display_name: str(row[COL.NAME]),
        class_type: str(row[COL.CLASS_TYPE]),
        manufacturer: str(row[COL.MANUFACTURER]),
        qty_in_base_set: num(row[COL.QTY_IN_BASE_SET]),
        base_size: str(row[COL.BASE_SIZE]),
        base_qty: num(row[COL.BASE_QTY]),
        models_per_squad: num(row[COL.MODELS_PER_SQUAD]),
        models_per_pack: num(row[COL.MODELS_PER_PACK]),
        magnets: num(row[COL.MAGNETS]),
        flight_stand_diameter: str(row[COL.FLIGHT_STAND_DIAMETER]),
        flight_stand_length: str(row[COL.FLIGHT_STAND_LENGTH]),
        flight_stand_connector: str(row[COL.FLIGHT_STAND_CONNECTOR]),
        cost: num(row[COL.PTS]) ?? 0,
        init: num(row[COL.INIT]),
        dodge: num(row[COL.DODGE]),
        defense: num(row[COL.DEFENSE]),
        hp: num(row[COL.HP]),
        speed: str(row[COL.SPEED]),
        weapons: WEAPON_COLS.map((weaponCols) => parseWeapon(row, weaponCols)).filter(Boolean),
        abilities: ABILITY_COLS.map((col) => str(row[col])).filter(Boolean),
        traits: TRAIT_COLS.map((col) => str(row[col])).filter(Boolean),
        cards_front: cardsFront.map(s => s + '.png'),
        card_back: cardsFront.length ? cardsFront[0] + ' Back.png' : '',
    }
}

function pad(depth) {
    return '    '.repeat(depth)
}

function formatKey(key) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `'${key}'`
}

function formatLiteral(value, depth) {
    if (value === null) {
        return 'null'
    }

    if (typeof value === 'number') {
        return String(value)
    }

    if (typeof value === 'string') {
        return `'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return '[]'
        }
        const items = value.map((item) => `${pad(depth + 1)}${formatLiteral(item, depth + 1)},`).join('\n')
        return `[\n${items}\n${pad(depth)}]`
    }

    const keys = Object.keys(value)
    const props = keys
        .map((key) => `${pad(depth + 1)}${formatKey(key)}: ${formatLiteral(value[key], depth + 1)},`)
        .join('\n')
    return `{\n${props}\n${pad(depth)}}`
}

async function main() {
    const csv = readFileSync(csvPath, 'utf8')
    const allRows = parseCsv(csv)
    const columns = resolveColumns(allRows[HEADER_ROW_INDEX])
    const rows = allRows.slice(HEADER_ROW_INDEX + 1).filter((row) => str(row[columns.COL.NAME]))

    // Ids are keyed by the unit's slug so re-running the importer never
    // changes an id for a unit that's still in the grid, even if rows are
    // reordered, inserted, or removed. New units get the next unused id.
    const existingIds = loadExistingIds(outPath)
    let nextId = Object.values(existingIds).reduce((max, id) => Math.max(max, id), 0) + 1

    const usedKeys = new Set()
    const units = {}

    for (const row of rows) {
        const name = str(row[columns.COL.NAME])
        const key = slugKey(name)

        if (usedKeys.has(key)) {
            throw new Error(`duplicate unit key generated from name: ${name}`)
        }
        usedKeys.add(key)

        const id = existingIds[key] ?? nextId++
        units[key] = parseUnit(row, id, columns)
    }

    const removedKeys = Object.keys(existingIds).filter((key) => !usedKeys.has(key))
    if (removedKeys.length > 0) {
        console.warn(`Note: these units are no longer in the CSV, their ids will not be reused: ${removedKeys.join(', ')}`)
    }

    const { validateUnits } = await loadAbilitiesModule(abilitiesPath)

    validateUnits(units)

    const content = generate(units)

    writeFileSync(outPath, content, 'utf8')
    console.log(`Wrote ${Object.keys(units).length} units to ${path.relative(process.cwd(), outPath)}`)
}

main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
})

function generate(units) {
    return `export type Weapon = {
    name: string,
    range: string
    accuracy: string
    damage: string
    keywords: string[],
}

export type Unit = {
    id: number
    display_name: string
    class_type: string | null
    manufacturer: string | null
    qty_in_base_set: number | null
    base_size: string | null
    base_qty: number | null
    models_per_squad: number | null
    models_per_pack: number | null
    magnets: number | null
    flight_stand_diameter: string | null
    flight_stand_length: string | null
    flight_stand_connector: string | null
    cost: number
    init: number | null
    dodge: number | null
    defense: number | null
    hp: number | null
    speed: string | null
    weapons: Weapon[]
    abilities: string[]
    traits: string[]
    cards_front: string[]
    card_back: string,
}

export const UNITS: Record<string, Unit> = ${formatLiteral(units, 0)}
`
}
