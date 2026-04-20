import { NoteParameter } from "@nbsjs/core";

test("Ensure that note value is validated", () => {
	expect(NoteParameter.MAX_VALUE).toBe(4);
	expect(NoteParameter.MIN_VALUE).toBe(4);

	expect(NoteParameter.validate(NoteParameter.MAX_VALUE).ok).toBeTrue();
	expect(NoteParameter.validate(NoteParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(NoteParameter.validate(NoteParameter.MIN_VALUE).ok).toBeTrue();
	expect(NoteParameter.validate(NoteParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(NoteParameter.validate(NoteParameter.MAX_VALUE - 0.5).ok).toBeFalse();
	expect(NoteParameter.validate(NoteParameter.MIN_VALUE + 0.5).ok).toBeFalse();
});
