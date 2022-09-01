import { Button } from './../components/button';
import { openModal } from '../components/modal';
import { el } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { gameContainer } from '../systems/game';
import { playLevel } from '../systems/play';
import { state } from '../systems/state';
import { Base } from './base';
import { levels } from '../data/levels';
import { renderLevels } from '../screens/levels';

export class End extends Base {
	constructor(
		rotation: number,
		cellKey: string,
	) {
		super(
			cellKey,
			el('div.cell'),
			getSVGElement(SVGs.fairy),
			rotation,
			false,
			true,
		);
	}

	// interact(input?: number) {
	// 	console.log('play - end - ' + this.cellKey);

	// 	// TODO: Don't overwrite collectables
	// 	state.progress[state.level] = [true, 0];
	// 	renderLevels();

	// 	let goToLevels = true;

	// 	const buttons: Button[] = [
	// 		{
	// 			content: 'Levels',
	// 			type: 'normal',
	// 			onClickCallback: () => {
	// 				state.screen = 'levels';
	// 			},
	// 		},
	// 		{
	// 			content: 'Replay',
	// 			type: 'normal',
	// 			onClickCallback: () => {
	// 				playLevel(state.level);
	// 				goToLevels = false;
	// 			},
	// 		},
	// 	];

	// 	if (state.level < levels.length - 1) {
	// 		buttons.push({
	// 			content: 'Next',
	// 			type: 'primary',
	// 			onClickCallback: () => {
	// 				playLevel(state.level + 1);
	// 				goToLevels = false;
	// 			}
	// 		});
	// 	}

	// 	openModal(gameContainer, 'You Won!', '', buttons, () => {
	// 		if (goToLevels) {
	// 			state.screen = 'levels';
	// 		}
	// 	});
	// }
}
