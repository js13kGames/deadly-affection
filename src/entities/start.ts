import { el } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { Base } from './base';

export class Start extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		super(
			cellKey,
			el('div.cell'),
			getSVGElement(SVGs.necromancer),
			rotation,
			true,
			true,
		);

		this.paths = [null, null, 0, null];
		this.inputs = [false, false, true, false];
	}

	// play(input?: number) {
	// 	console.log('============');
	// 	console.log('play - start - ' + this.cellKey);

	// 	this.logState();

	// 	if (input == null) {
	// 		for (let i = 0; i < this.outputs.length; i += 1) {
	// 			if (this.outputs[i]) {
	// 				const neighbor = this.neighbors[(this.rotation + i) % 4];

	// 				if (neighbor) {
	// 					console.log(' -> ' + neighbor.cellKey);
	// 					neighbor.play((this.rotation + i + 2) % 4);
	// 				}
	// 			}
	// 		}
	// 	}
	// }
}
