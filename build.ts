import dts from "bun-plugin-dts";

await Bun.build({
	"entrypoints": ["src/index.ts"],
	"minify": true,
	"outdir": "dist",
	"plugins": [dts()],
	"sourcemap": "linked"
});
