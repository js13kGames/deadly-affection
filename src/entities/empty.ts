import { el } from '../helpers/redom';
import { Base } from './base';

export class Empty extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		super(
			cellKey,
			el('div.empty'),
			el('div.empty'),
			rotation,
			false,
			false,
		);

		this.paths = [2, 3, 0, 1];
	}

	// interact(input?: number) {
	// 	console.log('play - empty - ' + this.cellKey);
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
