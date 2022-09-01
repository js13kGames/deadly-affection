import { el } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { Base } from './base';

export class Block extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		super(
			cellKey,
			el('div.cell'),
			getSVGElement(SVGs['pirate-grave']),
			rotation,
			false,
			false,
		);
	}
}
