export type Unit = {
    id: number,
    display_name: string,
    cost: number
}

export const UNITS: Record<string, Unit> = {
    FOO: {
        id: 1,
        display_name: 'Foo',
        cost: 2,
    },
    BAR: {
        id: 2,
        display_name: 'Bar33',
        cost: 4,
    },
}

const ids: number[] = []
for (const [key, unit] of Object.entries(UNITS)) {

    if (ids.includes(unit.id)) {
        throw new Error(`duplicate unit id: ${unit.id}`)
    }

    ids.push(unit.id)
}
