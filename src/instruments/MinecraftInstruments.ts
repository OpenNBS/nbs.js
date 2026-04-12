/** biome-ignore-all assist/source/useSortedKeys: Breaks linting rule block */

import type { Identifier, ResourceNamespace } from "~/identifiers/ResourceLocation";
import type { Instrument } from "~/instruments/Instrument";
import type { SupportedVersionRange } from "~/parameters/VersionParameter";
import type { Result } from "~/types/validators/Result";

import { ResourceLocation } from "~/identifiers/ResourceLocation";
import { MinecraftInstrument } from "~/instruments/MinecraftInstrument";
import { MinecraftInstrumentBuilder } from "~/instruments/MinecraftInstrumentBuilder";
import { isWithinRange } from "~/validators/isWithinRange";
import { fail, ok } from "~/validators/results";

export type InstrumentId = number;

type MinecraftInstrumentIdentifiers = {
	[identifier: Identifier]: MinecraftInstrument;
};

const namespace: ResourceNamespace = "minecraft";

const harpIdentifier: ResourceLocation = new ResourceLocation(namespace, "harp");
const doubleBassIdentifier: ResourceLocation = new ResourceLocation(namespace, "double_bass");
const bassDrumIdentifier: ResourceLocation = new ResourceLocation(namespace, "bass_drum");
const snareDrumIdentifier: ResourceLocation = new ResourceLocation(namespace, "snare_drum");
const clickIdentifier: ResourceLocation = new ResourceLocation(namespace, "click");
const guitarIdentifier: ResourceLocation = new ResourceLocation(namespace, "guitar");
const fluteIdentifier: ResourceLocation = new ResourceLocation(namespace, "flute");
const bellIdentifier: ResourceLocation = new ResourceLocation(namespace, "bell");
const chimeIdentifier: ResourceLocation = new ResourceLocation(namespace, "chime");
const xylophoneIdentifier: ResourceLocation = new ResourceLocation(namespace, "xylophone");
const ironXylophoneIdentifier: ResourceLocation = new ResourceLocation(namespace, "iron_xylophone");
const cowBellIdentifier: ResourceLocation = new ResourceLocation(namespace, "cow_bell");
const didgeridooIdentifier: ResourceLocation = new ResourceLocation(namespace, "didgeridoo");
const bitIdentifier: ResourceLocation = new ResourceLocation(namespace, "bit");
const banjoIdentifier: ResourceLocation = new ResourceLocation(namespace, "banjo");
const plingIdentifier: ResourceLocation = new ResourceLocation(namespace, "pling");
const trumpetIdentifier: ResourceLocation = new ResourceLocation(namespace, "trumpet");
const trumpetExposedIdentifier: ResourceLocation = new ResourceLocation(
	namespace,
	"trumpet_exposed"
);
const trumpetWeatheredIdentifier: ResourceLocation = new ResourceLocation(
	namespace,
	"trumpet_weathered"
);
const trumpetOxidizedIdentifier: ResourceLocation = new ResourceLocation(
	namespace,
	"trumpet_oxidized"
);

const harpInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(harpIdentifier)
	.name("Harp")
	.soundFile("harp.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const doubleBassInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(doubleBassIdentifier)
	.name("Double Bass")
	.soundFile("dbass.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const bassDrumInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(bassDrumIdentifier)
	.name("Bass Drum")
	.soundFile("bdrum.ogg")
	.supportedVersion(0)
	.build();

const snareDrumInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(snareDrumIdentifier)
	.name("Snare Drum")
	.soundFile("sdrum.ogg")
	.supportedVersion(0)
	.build();

const clickInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(clickIdentifier)
	.name("Click")
	.soundFile("click.ogg")
	.supportedVersion(0)
	.build();

const guitarInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(guitarIdentifier)
	.name("Guitar")
	.soundFile("guitar.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const fluteInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(fluteIdentifier)
	.name("Flute")
	.soundFile("flute.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const bellInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(bellIdentifier)
	.name("Bell")
	.soundFile("bell.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const chimeInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(chimeIdentifier)
	.name("Chime")
	.soundFile("chime.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const xylophoneInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(xylophoneIdentifier)
	.name("Xylophone")
	.soundFile("xylobone.ogg")
	.pressKey()
	.supportedVersion(0)
	.build();

const ironXylophoneInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(ironXylophoneIdentifier)
	.name("Iron Xylophone")
	.soundFile("iron_xylophone.ogg")
	.pressKey()
	.supportedVersion(1)
	.build();

const cowBellInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(cowBellIdentifier)
	.name("Cow Bell")
	.soundFile("cow_bell.ogg")
	.pressKey()
	.supportedVersion(1)
	.build();

const didgeridooInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(didgeridooIdentifier)
	.name("Didgeridoo")
	.soundFile("didgeridoo.ogg")
	.pressKey()
	.supportedVersion(1)
	.build();

const bitInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(bitIdentifier)
	.name("Bit")
	.soundFile("bit.ogg")
	.pressKey()
	.supportedVersion(1)
	.build();

const banjoInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(banjoIdentifier)
	.name("Banjo")
	.soundFile("banjo.ogg")
	.pressKey()
	.supportedVersion(1)
	.build();

const plingInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(plingIdentifier)
	.name("Pling")
	.soundFile("pling.ogg")
	.pressKey()
	.supportedVersion(1)
	.build();

const trumpetInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(trumpetIdentifier)
	.name("Trumpet")
	.soundFile("trumpet.ogg")
	.pressKey()
	.supportedVersion(6)
	.build();

const trumpetExposedInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(trumpetExposedIdentifier)
	.name("Exposed Trumpet")
	.soundFile("exposed_trumpet.ogg")
	.pressKey()
	.supportedVersion(6)
	.build();

const trumpetWeatheredInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(trumpetWeatheredIdentifier)
	.name("Weathered Trumpet")
	.soundFile("weathered_trumpet.ogg")
	.pressKey()
	.supportedVersion(6)
	.build();

const trumpetOxidizedInstrument: MinecraftInstrument = new MinecraftInstrumentBuilder()
	.identifier(trumpetOxidizedIdentifier)
	.name("Oxidized Trumpet")
	.soundFile("oxidized_trumpet.ogg")
	.pressKey()
	.supportedVersion(6)
	.build();

const instrumentIds: MinecraftInstrument[] = [
	harpInstrument,
	doubleBassInstrument,
	bassDrumInstrument,
	snareDrumInstrument,
	clickInstrument,
	guitarInstrument,
	fluteInstrument,
	bellInstrument,
	chimeInstrument,
	xylophoneInstrument,
	ironXylophoneInstrument,
	cowBellInstrument,
	didgeridooInstrument,
	bitInstrument,
	plingInstrument,
	trumpetInstrument,
	trumpetExposedInstrument,
	trumpetWeatheredInstrument,
	trumpetOxidizedInstrument
];

const instrumentIdentifiers: MinecraftInstrumentIdentifiers = Object.fromEntries(
	instrumentIds.map((instrument) => [instrument.identifier.toString(), instrument])
);

export const MinecraftInstruments = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts as an enum
	get NAMESPACE(): ResourceNamespace {
		return namespace;
	},

	get HARP(): MinecraftInstrument {
		return harpInstrument;
	},

	get DOUBLE_BASS(): MinecraftInstrument {
		return doubleBassInstrument;
	},

	get BASS_DRUM(): MinecraftInstrument {
		return bassDrumInstrument;
	},

	get SNARE_DRUM(): MinecraftInstrument {
		return snareDrumInstrument;
	},

	get CLICK(): MinecraftInstrument {
		return clickInstrument;
	},

	get GUITAR(): MinecraftInstrument {
		return guitarInstrument;
	},

	get FLUTE(): MinecraftInstrument {
		return fluteInstrument;
	},

	get BELL(): MinecraftInstrument {
		return bellInstrument;
	},

	get CHIME(): MinecraftInstrument {
		return chimeInstrument;
	},

	get XYLOPHONE(): MinecraftInstrument {
		return xylophoneInstrument;
	},

	get IRON_XYLOPHONE(): MinecraftInstrument {
		return ironXylophoneInstrument;
	},

	get COW_BELL(): MinecraftInstrument {
		return cowBellInstrument;
	},

	get DIDGERIDOO(): MinecraftInstrument {
		return didgeridooInstrument;
	},

	get BIT(): MinecraftInstrument {
		return bitInstrument;
	},

	get BANJO(): MinecraftInstrument {
		return banjoInstrument;
	},

	get PLING(): MinecraftInstrument {
		return plingInstrument;
	},

	get TRUMPET(): MinecraftInstrument {
		return trumpetInstrument;
	},

	get TRUMPET_EXPOSED(): MinecraftInstrument {
		return trumpetExposedInstrument;
	},

	get TRUMPET_WEATHERED(): MinecraftInstrument {
		return trumpetWeatheredInstrument;
	},

	get TRUMPET_OXIDIZED(): MinecraftInstrument {
		return trumpetOxidizedInstrument;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts as an enum

	getSupportedFor(version: SupportedVersionRange): MinecraftInstrument[] {
		const supportedInstruments: MinecraftInstrument[] = [];

		for (const instrument of instrumentIds) {
			if (instrument.supportedVersion > version) {
				continue;
			}

			supportedInstruments.push(instrument);
		}

		return supportedInstruments;
	},

	toId(instrument: MinecraftInstrument): InstrumentId {
		const index = instrumentIds.indexOf(instrument);

		if (index === undefined) {
			throw "Instrument does not exist within the Minecraft instrument array";
		}

		return index;
	},

	fromId(id: number): MinecraftInstrument {
		MinecraftInstruments.checkId(id).ensure();

		return instrumentIds[id];
	},

	fromIdentifier(identifier: Identifier): MinecraftInstrument {
		MinecraftInstruments.checkIdentifier(identifier).ensure();

		return instrumentIdentifiers[identifier];
	},

	fromResourceLocation(resourceLocation: ResourceLocation): MinecraftInstrument {
		return MinecraftInstruments.fromIdentifier(resourceLocation.toString());
	},

	checkId(id: number): Result {
		return isWithinRange(id, 0, instrumentIds.length - 1);
	},

	checkIdentifier(identifier: Identifier): Result {
		return identifier in instrumentIdentifiers
			? ok()
			: fail("Instrument identifier does not exist");
	},

	validate(instrument: Instrument): Result {
		const isMinecraftInstrument = instrument instanceof MinecraftInstrument;

		return isMinecraftInstrument
			? ok()
			: fail("Instrument does not exist within the vanilla instrument namespace");
	}
};
