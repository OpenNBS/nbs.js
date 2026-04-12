import type {
	SupportedVersionRange,
	UnknownSupportedVersionRange
} from "~/parameters/VersionParameter";

import { HeaderAutoSave } from "~/headers/HeaderAutoSave";
import { HeaderLoop } from "~/headers/HeaderLoop";
import { HeaderStatistics } from "~/headers/HeaderStatistics";
import { HeaderTempo } from "~/headers/HeaderTempo";
import { VersionParameter } from "~/parameters/VersionParameter";

import type { Optional } from "type-fest";

export type HeaderVersion = SupportedVersionRange;
export type HeaderName = string;
export type HeaderAuthor = string;
export type HeaderDescription = string;
export type HeaderSongName = string;

export type OptionalHeaderName = Optional<HeaderName>;
export type OptionalHeaderAuthor = Optional<HeaderAuthor>;
export type OptionalHeaderDescription = Optional<HeaderDescription>;
export type OptionalHeaderImportName = Optional<HeaderSongName>;

export type UnknownHeaderVersion = UnknownSupportedVersionRange;

export class HeaderLike {
	public static get DEFAULT_VERSION(): HeaderVersion {
		return VersionParameter.MAX_SUPPORTED_VERSION;
	}

	public static get DEFAULT_NAME(): OptionalHeaderName {
		return undefined;
	}

	public static get DEFAULT_AUTHOR(): OptionalHeaderAuthor {
		return undefined;
	}

	public static get DEFAULT_ORIGINAL_AUTHOR(): OptionalHeaderAuthor {
		return undefined;
	}

	public static get DEFAULT_DESCRIPTION(): OptionalHeaderDescription {
		return undefined;
	}

	public static get DEFAULT_IMPORT_NAME(): OptionalHeaderImportName {
		return undefined;
	}

	readonly #autoSave = new HeaderAutoSave();
	readonly #loop = new HeaderLoop();
	readonly #statistics = new HeaderStatistics();
	readonly #tempo = new HeaderTempo();

	#version: HeaderVersion = HeaderLike.DEFAULT_VERSION;

	#name: OptionalHeaderName = HeaderLike.DEFAULT_NAME;
	#author: OptionalHeaderAuthor = HeaderLike.DEFAULT_AUTHOR;
	#originalAuthor: OptionalHeaderAuthor = HeaderLike.DEFAULT_ORIGINAL_AUTHOR;

	#description: OptionalHeaderDescription = HeaderLike.DEFAULT_DESCRIPTION;

	#importName: OptionalHeaderImportName = HeaderLike.DEFAULT_IMPORT_NAME;

	public get version(): HeaderVersion {
		return this.#version;
	}

	public set version(version: UnknownHeaderVersion) {
		VersionParameter.validate(version).ensure();

		this.#version = version as HeaderVersion;
	}

	public get name(): OptionalHeaderName {
		return this.#name;
	}

	public set name(name: OptionalHeaderName) {
		this.#name = name;
	}

	public get author(): OptionalHeaderAuthor {
		return this.#author;
	}

	public set author(author: OptionalHeaderAuthor) {
		this.#author = author;
	}

	public get originalAuthor(): OptionalHeaderAuthor {
		return this.#originalAuthor;
	}

	public set originalAuthor(originalAuthor: OptionalHeaderAuthor) {
		this.#originalAuthor = originalAuthor;
	}

	public get description(): OptionalHeaderDescription {
		return this.#description;
	}

	public set description(description: OptionalHeaderDescription) {
		this.#description = description;
	}

	public get importName(): OptionalHeaderImportName {
		return this.#importName;
	}

	public set importName(importName: OptionalHeaderImportName) {
		this.#importName = importName;
	}

	public get autoSave(): HeaderAutoSave {
		return this.#autoSave;
	}

	public get loop(): HeaderLoop {
		return this.#loop;
	}

	public get statistics(): HeaderStatistics {
		return this.#statistics;
	}

	public get tempo(): HeaderTempo {
		return this.#tempo;
	}
}
