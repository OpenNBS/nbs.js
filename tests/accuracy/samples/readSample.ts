import { join } from "node:path";

export async function readSample(fileName: string): Promise<Uint8Array> {
	const path = join(import.meta.dir, fileName);

	const file = Bun.file(path);

	return await file.bytes();
}
