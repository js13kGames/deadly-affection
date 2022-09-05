import { el } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { state } from '../systems/state';
import { Base } from './base';

export class Start extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		let img = null;
		
		if (state.arcadian.image != '') {
			img = el('img') as HTMLImageElement;
			img.src = state.arcadian.image;
		}

		super(
			'start',
			cellKey,
			el('div.cell', img),
			img ? el('div.empty') : getSVGElement(SVGs.necromancer),
			rotation,
			true,
			true,
			[0, 0, 0, 0],
		);

		this.inputs = [true, true, true, true];
	}
}
