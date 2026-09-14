import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transformWithOxc, type Plugin } from 'vite';

const dataDir = path.resolve(import.meta.dirname, '../../data');
const dataOutputFile = path.resolve(import.meta.dirname, '../../../static-data/data.json');

async function importTsModule(filePath: string): Promise<Record<string, unknown>> {
    const source = await readFile(filePath, 'utf8');
    const { code } = await transformWithOxc(source, filePath);
    const dataUrl = `data:text/javascript,${encodeURIComponent(code)}`;

    return import(dataUrl);
}

async function buildDataJson(): Promise<void> {
    const files = (await readdir(dataDir)).filter((file) => file.endsWith('.ts'));

    const data: Record<string, unknown> = {};

    for (const file of files) {
        const exports = await importTsModule(path.join(dataDir, file));

        Object.assign(data, exports);
    }

    await mkdir(path.dirname(dataOutputFile), { recursive: true });
    await writeFile(dataOutputFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function staticDataPlugin(): Plugin {
    return {
        name: 'oasis:static-data',
        async buildStart() {
            await buildDataJson();
        },
        configureServer(server) {
            server.watcher.add(dataDir);

            server.watcher.on('all', async (event, file) => {
                if (file.startsWith(dataDir) && file.endsWith('.ts') && event !== 'unlinkDir') {
                    await buildDataJson();
                }
            });
        },
    };
}
