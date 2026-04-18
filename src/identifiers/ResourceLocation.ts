import type { Result } from "~/types/validators/Result";

import { fail, mergeResults, ok } from "~/validators/results";

function toPattern(global: boolean, ...characters: string[]): RegExp {
	return new RegExp(`[${characters.join()}]`, global ? "g" : undefined);
}

const allowedNamespaceCharacters: string[] = ["a-z", "0-9", "_", "\\-", "."];
const allowedPathCharacters: string[] = [...allowedNamespaceCharacters, "\\/"];

const validNamespacePattern: RegExp = toPattern(false, ...allowedNamespaceCharacters);
const validPathPattern: RegExp = toPattern(false, ...allowedPathCharacters);

const invalidNamespacePattern: RegExp = toPattern(true, "^", ...allowedNamespaceCharacters);
const invalidPathPattern: RegExp = toPattern(true, "^", ...allowedPathCharacters);

export type ResourceNamespace = string;
export type ResourcePath = string;

export type Identifier = string;

export class ResourceLocation {
	#namespace: ResourceNamespace;
	#path: ResourcePath;

	public constructor(namespace: ResourceNamespace, path: ResourcePath) {
		ResourceLocation.validate(namespace, path).ensure();

		this.#namespace = namespace;
		this.#path = path;
	}

	public get namespace(): ResourceNamespace {
		return this.#namespace;
	}

	public get path(): ResourcePath {
		return this.#path;
	}

	public set namespace(namespace: ResourceNamespace) {
		ResourceLocation.validateNamespace(namespace).ensure();

		this.#namespace = namespace;
	}

	public set path(path: ResourcePath) {
		ResourceLocation.validatePath(path).ensure();

		this.#path = path;
	}

	public toString(): string {
		return `${this.#namespace}:${this.#path}`;
	}

	public static of(namespace: ResourceNamespace, path: ResourcePath): ResourceLocation {
		return new ResourceLocation(namespace, path);
	}

	public static from(identifier: Identifier): ResourceLocation {
		const [namespace, path] = identifier.split(":");

		ResourceLocation.validate(namespace, path).ensure();

		return new ResourceLocation(namespace, path);
	}

	public static sanitizeNamespace(namespace: ResourceNamespace): ResourceNamespace {
		return namespace.toLowerCase().replaceAll(" ", "_").replace(invalidNamespacePattern, "");
	}

	public static sanitizePath(path: ResourcePath): ResourcePath {
		return path.toLowerCase().replaceAll(" ", "_").replace(invalidPathPattern, "");
	}

	public static validate(namespace: ResourceNamespace, path: ResourcePath): Result {
		const namespaceStatus = ResourceLocation.validateNamespace(namespace);
		const pathStatus = ResourceLocation.validatePath(path);

		return mergeResults(namespaceStatus, pathStatus);
	}

	public static validateNamespace(namespace: ResourceNamespace): Result {
		// This will be removed once the NBS specification supports instrument namespaces
		if (namespace !== "minecraft" && namespace !== "custom") {
			return fail(`Namespace "${namespace}" must be either "minecraft" or "custom"`);
		}

		if (validNamespacePattern.test(namespace)) {
			return ok();
		}

		return fail(`Namespace "${namespace}" uses invalid characters`);
	}

	public static validatePath(path: ResourcePath): Result {
		if (validPathPattern.test(path)) {
			return ok();
		}

		return fail(`Path "${path}" uses invalid characters`);
	}
}
