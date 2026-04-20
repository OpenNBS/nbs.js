import { NoteParameter } from "@nbsjs/core";

test("Ensure that note value is validated", () => {
	expect(NoteParameter.MAX_NOTE).toBe(4);
	expect(NoteParameter.MIN_NOTE).toBe(4);

	expect(NoteParameter.validate(NoteParameter.MAX_NOTE).ok).toBeTrue();
	expect(NoteParameter.validate(NoteParameter.MAX_NOTE + 1).ok).toBeFalse();

	expect(NoteParameter.validate(NoteParameter.MIN_NOTE).ok).toBeTrue();
	expect(NoteParameter.validate(NoteParameter.MIN_NOTE - 1).ok).toBeFalse();

	expect(NoteParameter.validate(NoteParameter.MAX_NOTE - 0.5).ok).toBeFalse();
	expect(NoteParameter.validate(NoteParameter.MIN_NOTE + 0.5).ok).toBeFalse();
});
