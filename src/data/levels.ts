export const EntityBlock = 0;
export const EntityStart = 1;
export const EntityEnd = 2;
export const EntityTurnOneSide = 3;
export const EntityTurnBothSides = 4;
export const EntitySplit = 5;
export const EntityTunnel = 6;
export const EntityCollectable = 7;

export const Rotation0 = 0;
export const Rotation90 = 1;
export const Rotation180 = 2;
export const Rotation270 = 3;

/** [width, height] */
export type LevelSize = [number, number];
export type EntityType = typeof EntityBlock | typeof EntityStart | typeof EntityEnd | typeof EntityTurnOneSide | typeof EntityTurnBothSides | typeof EntitySplit | typeof EntityTunnel | typeof EntityCollectable;
export type Rotation = typeof Rotation0 | typeof Rotation90 | typeof Rotation180 | typeof Rotation270;
export type Entity = [EntityType, Rotation] | undefined;


export type Level = [LevelSize, Entity[]];

const Empty = undefined;

export const levels: Level[] = [
	[
		[3, 3],
		[
			Empty, [EntityEnd, Rotation0], Empty,
			Empty, Empty, Empty,
			Empty, [EntityStart, Rotation270], Empty,
		],
	],
	[
		[3, 3],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation90],
			Empty, Empty, Empty,
			Empty, Empty, [EntityStart, Rotation270],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityCollectable, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityCollectable, Rotation0], Empty, Empty,
			[EntityCollectable, Rotation0], Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 3],
		[
			Empty, [EntityEnd, Rotation0], Empty,
			Empty, Empty, Empty,
			Empty, [EntityStart, Rotation0], Empty,
		],
	],
	[
		[3, 3],
		[
			[EntityEnd, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityCollectable, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityCollectable, Rotation0], Empty, [EntityCollectable, Rotation0],
			[EntityCollectable, Rotation0], Empty, Empty,
			[EntityTurnOneSide, Rotation90], [EntityCollectable, Rotation0], [EntityStart, Rotation0],
		],
	],
	[
		[3, 3],
		[
			Empty, [EntityEnd, Rotation0], Empty,
			Empty, Empty, Empty,
			Empty, [EntityStart, Rotation0], Empty,
		],
	],
	[
		[3, 3],
		[
			[EntityEnd, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityCollectable, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation270], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityCollectable, Rotation0], Empty, [EntityTunnel, Rotation0],
			[EntityTurnOneSide, Rotation90], [EntityBlock, Rotation0], [EntityStart, Rotation0],
		],
	],
	[
		[5, 10],
		[
			[EntityEnd, Rotation0], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty, [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation270], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityCollectable, Rotation0], Empty, [EntityTunnel, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation90], [EntityBlock, Rotation0], [EntityBlock, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty, [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation270], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityCollectable, Rotation0], Empty, [EntityTunnel, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation90], [EntityBlock, Rotation0], [EntityStart, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
		],
	],
	[
		[3, 3],
		[
			Empty, [EntityEnd, Rotation0], Empty,
			Empty, Empty, Empty,
			Empty, [EntityStart, Rotation0], Empty,
		],
	],
	[
		[3, 3],
		[
			[EntityEnd, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], Empty, [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityCollectable, Rotation0], Empty, Empty,
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation90], Empty, [EntityStart, Rotation0],
		],
	],
	[
		[3, 5],
		[
			[EntityEnd, Rotation0], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty,
			[EntityTurnOneSide, Rotation270], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityCollectable, Rotation0], Empty, [EntityTunnel, Rotation0],
			[EntityTurnOneSide, Rotation90], [EntityBlock, Rotation0], [EntityStart, Rotation0],
		],
	],
	[
		[5, 10],
		[
			[EntityEnd, Rotation0], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty, [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation270], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityCollectable, Rotation0], Empty, [EntityTunnel, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation90], [EntityBlock, Rotation0], [EntityBlock, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270], [EntityTurnOneSide, Rotation270],
			Empty, Empty, Empty, [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation270], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityCollectable, Rotation0], Empty, [EntityTunnel, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
			[EntityTurnOneSide, Rotation90], [EntityBlock, Rotation0], [EntityStart, Rotation0], [EntityTurnBothSides, Rotation0], [EntitySplit, Rotation0],
		],
	],
];
