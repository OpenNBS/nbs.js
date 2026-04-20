export type Negate<Member extends number> = Member extends number
	? `-${Member}` extends `${infer Number extends number}`
		? Number
		: never
	: never;
