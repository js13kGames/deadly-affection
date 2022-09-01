import { el } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { Base } from './base';

export class Collectable extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		super(
			cellKey,
			el('div.cell', getSVGElement(SVGs.hearts)),
			el('div.empty'),
			rotation,
			false,
			false,
		);
	}

	// interact(input?: number) {
	// 	console.log('play - collectable - ' + this.cellKey);
	// 	if (input != null) {
	// 		console.log(input, this.rotation, (input + 2 + this.rotation) % 4);
	// 		const neighbor = this.neighbors[(input + 2 + this.rotation) % 4];

	// 		if (neighbor) {
	// 			console.log(' -> ' + neighbor.cellKey);
	// 			neighbor.interact(input);
	// 		}
	// 	}
	// }
}
