import { Layer } from "@nbsjs/core";

const layer = new Layer({
	"name": "Demo"
});

// The "notes" property provides helper functions such as...
layer.notes.add(0, 0, {
	"key": 42
});

layer.notes.add(8, 0, {
	"key": 24
});

// Deletes the note on tick 8 (which was just added)
layer.notes.delete(8);

// These properties are only used in Note Block Studio and do not affect the functions above
layer.isSolo = true;
layer.isLocked = true;
