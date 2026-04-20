import { Header, VersionParameter } from "@nbsjs/core";

test("Ensure that header fields are validated", () => {
	const header = new Header();

	expect(() => {
		header.size = -1;
	}).toThrow();

	expect(() => {
		header.size = 1.5;
	}).toThrow();

	expect(() => {
		header.version = VersionParameter.MAX_SUPPORTED_VERSION + 1;
	}).toThrow();

	expect(() => {
		header.version = VersionParameter.MAX_SUPPORTED_VERSION - 0.5;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		header.autoSave = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		header.loop = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		header.statistics = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		header.tempo = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		header.layers = undefined;
	}).toThrow();
});

test("Ensure that header layer fields are validated", () => {
	const header = new Header();

	expect(() => {
		header.layers.total = -1;
	}).toThrow();

	expect(() => {
		header.layers.total = 1.5;
	});
});
