import { el } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { Base } from './base';

export class TurnOneSide extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		super(
			cellKey,
			el('div.cell', getSVGElement(SVGs['turn-one-side'])),
			el('div.empty'),
			rotation,
			true,
			false,
		);
	}

	// interact(input?: number) {
	// 	console.log('play - turn one side - ' + this.cellKey);
	// 	if (input != null) {
	// 		const inputSide = (input - this.rotation % 4 + 4) % 4;

	// 		let outputSide;
	// 		if (inputSide === 0) {
	// 			outputSide = (1 + this.rotation) % 4;
	// 		} else if (inputSide === 1) {
	// 			outputSide = (0 + this.rotation) % 4;
	// 		}

	// 		console.log(this.neighbors);
	// 		console.log(input, this.rotation, inputSide + ' -> ' + outputSide);

	// 		if (outputSide != null) {
	// 			const neighbor = this.neighbors[outputSide];

	// 			if (neighbor) {
	// 				console.log(' -> ' + neighbor.cellKey);
	// 				neighbor.interact((outputSide + 2) % 4);
	// 			}
	// 		}
	// 	}
	// }
}
