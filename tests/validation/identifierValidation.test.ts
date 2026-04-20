import { ResourceLocation } from "@nbsjs/core";

test("Ensure that resource location fields are validated", () => {
	const identifier = new ResourceLocation("custom", "bar");

	const invalidNamespaces = ["FOO", "foo/", "!@#"];
	const invalidPaths = ["BAR", "$%^"];

	// This will be removed once the NBS specification supports instrument namespaces
	expect(() => {
		identifier.namespace = "foo";
	}).toThrow();

	for (const invalidNamespace of invalidNamespaces) {
		expect(() => {
			identifier.namespace = invalidNamespace;
		}).toThrow();

		expect(() => {
			// This will work once the NBS specification supports instrument namespaces
			//identifier.namespace = ResourceLocation.sanitizeNamespace(invalidNamespace);
		}).not.toThrow();
	}

	for (const invalidPath of invalidPaths) {
		expect(() => {
			identifier.path = invalidPath;
		}).toThrow();

		expect(() => {
			identifier.path = ResourceLocation.sanitizePath(invalidPath);
		}).not.toThrow();
	}

	expect(() => {
		identifier.path = "bar/baz";
	}).not.toThrow();
});
