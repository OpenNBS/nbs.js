import type {
	SupportedVersionRange,
	UnknownSupportedVersionRange
} from "~/parameters/VersionParameter";

import { VersionParameter } from "~/parameters/VersionParameter";

import type { Optional } from "type-fest";

export type MetadataVersion = SupportedVersionRange;
export type MetadataName = string;
export type MetadataAuthor = string;
export type MetadataDescription = string;
export type MetadataImportName = string;

export type OptionalMetadataName = Optional<MetadataName>;
export type OptionalMetadataAuthor = Optional<MetadataAuthor>;
export type OptionalMetadataDescription = Optional<MetadataDescription>;
export type OptionalMetadataImportName = Optional<MetadataImportName>;

export type UnknownVersion = UnknownSupportedVersionRange;

export class MetadataPiece {
	public static get DEFAULT_VERSION(): MetadataVersion {
		return VersionParameter.MAX_SUPPORTED_VERSION;
	}

	public static get DEFAULT_NAME(): OptionalMetadataName {
		return undefined;
	}

	public static get DEFAULT_AUTHOR(): OptionalMetadataAuthor {
		return undefined;
	}

	public static get DEFAULT_ORIGINAL_AUTHOR(): OptionalMetadataAuthor {
		return undefined;
	}

	public static get DEFAULT_DESCRIPTION(): OptionalMetadataDescription {
		return undefined;
	}

	public static get DEFAULT_IMPORT_NAME(): OptionalMetadataImportName {
		return undefined;
	}

	#version: MetadataVersion = MetadataPiece.DEFAULT_VERSION;
	#name: OptionalMetadataName = MetadataPiece.DEFAULT_NAME;
	#author: OptionalMetadataAuthor = MetadataPiece.DEFAULT_AUTHOR;
	#originalAuthor: OptionalMetadataAuthor = MetadataPiece.DEFAULT_ORIGINAL_AUTHOR;
	#description: OptionalMetadataDescription = MetadataPiece.DEFAULT_DESCRIPTION;
	#importName: OptionalMetadataImportName = MetadataPiece.DEFAULT_IMPORT_NAME;

	public get version(): MetadataVersion {
		return this.#version;
	}

	public set version(version: UnknownVersion) {
		VersionParameter.validate(version).ensure();

		this.#version = version as MetadataVersion;
	}

	public get name(): OptionalMetadataName {
		return this.#name;
	}

	public set name(name: OptionalMetadataName) {
		this.#name = name;
	}

	public get author(): OptionalMetadataAuthor {
		return this.#author;
	}

	public set author(author: OptionalMetadataAuthor) {
		this.#author = author;
	}

	public get originalAuthor(): OptionalMetadataAuthor {
		return this.#originalAuthor;
	}

	public set originalAuthor(originalAuthor: OptionalMetadataAuthor) {
		this.#originalAuthor = originalAuthor;
	}

	public get description(): OptionalMetadataDescription {
		return this.#description;
	}

	public set description(description: OptionalMetadataDescription) {
		this.#description = description;
	}

	public get importName(): OptionalMetadataImportName {
		return this.#importName;
	}

	public set importName(importName: OptionalMetadataImportName) {
		this.#importName = importName;
	}
}
