import { ResourceLocation } from "@nbsjs/core";

test("Create a ResourceLocation identifier", () => {
	// Resource locations are used to specify certain objects such as an `Instrument`
	// They function similarly to Minecraft's identifier class, sometimes referred to by the same name
	const fooIdentifier = new ResourceLocation("custom", "foo");

	expect(fooIdentifier.namespace).toBe("custom");
	expect(fooIdentifier.path).toBe("foo");

	expect(fooIdentifier.toString()).toBe("custom:foo");

	// The class also provides shorthand initializers
	const barIdentifier = ResourceLocation.from("custom:bar");

	expect(barIdentifier.namespace).toBe("custom");
	expect(barIdentifier.path).toBe("bar");

	// Resource locations use the same validation schema as Minecraft's identifiers
	fooIdentifier.path = "foo/bar/baz";

	expect(fooIdentifier.path).toBe("foo/bar/baz");

	expect(() => {
		fooIdentifier.path = "FOO" /* Invalid! */;
	}).toThrow();

	// Namespaces and paths can be sanitized using the validation schema
	const sanitizedPath = ResourceLocation.sanitizePath("FOO bar!");

	expect(sanitizedPath).toBe("foo_bar");
});
