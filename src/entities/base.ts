import { playSound } from '../components/music';
import { el, mount } from '../helpers/redom';
import { screens } from '../systems/game';
import { processPuzzleProgress } from '../systems/play';
import { Rotation } from './../data/levels';

export type PathDirection = Rotation[] | Rotation | null;

export class Base {
	public left = 0;
	public bottom = 0;
	public distanceToCenter = 0;

	public neighbors!: [Base, Base, Base, Base];

	public inputs: [boolean, boolean, boolean, boolean] = [false, false, false, false];
	public outputs: [boolean, boolean, boolean, boolean] = [false, false, false, false];

	public lines: [HTMLElement | null, HTMLElement | null, HTMLElement | null, HTMLElement | null] = [null, null, null, null];

	constructor(
		public name: string,
		public cellKey: string,
		public cellElement: HTMLElement,
		public iconElement: HTMLElement,
		public rotation: number,
		public rotatable = false,
		public withBackground = false,
		public paths: [PathDirection, PathDirection, PathDirection, PathDirection] = [null, null, null, null],
	) {
		this.cellElement.style.transform = 'rotate(' + (90 * this.rotation) + 'deg)';
		for (let i = 0; i < this.rotation; i += 1) {
			// Move first element to end of array
			const poppedpath = this.paths.pop();
			this.paths.unshift(poppedpath != null ? poppedpath : null);
		}

		if (this.rotatable) {
			this.cellElement.onclick = () => {
				playSound('rotate');
				this.rotation = this.rotation + 1;
				this.cellElement.style.transform = 'rotate(' + (90 * this.rotation) + 'deg)';

				const img = this.cellElement.querySelector('img');
				if (img) {
					img.style.transform = 'rotate(' + (-90 * this.rotation) + 'deg)';
				}

				// Move first element to end of array
				const poppedpath = this.paths.pop();
				this.paths.unshift(poppedpath != null ? poppedpath : null);

				this.interact('add');

				processPuzzleProgress();
			}
		} else {
			this.cellElement.style.pointerEvents = 'none';
		}

		if (this.withBackground === false) {
			this.cellElement.style.background = 'transparent';
			this.cellElement.style.borderColor = 'transparent';
		}

		this.cellElement.classList.add(this.name);
		this.iconElement.classList.add(this.name);

		this.cellElement.classList.toggle('active', this.isActive());
		this.iconElement.classList.toggle('active', this.isActive());
	}

	interact(action: 'add' | 'remove', from?: number) {
		// console.warn(action, from);

		if (action === 'remove' && from != null) {
			if (this.inputs[from] === false) {
				return;
			}

			this.inputs[from] = false;
		}

		if (action === 'add' && from != null) {
			if (this.inputs[from] === true) {
				return;
			}

			this.inputs[from] = true;
		}

		const newOutputs: [boolean, boolean, boolean, boolean] = [false, false, false, false];

		// console.log('inputs', this.inputs);
		// console.log('paths', this.paths);
		for (let i = 0; i < this.inputs.length; i += 1) {
			if (this.inputs[i] === true) {
				const path = this.paths[i];
				
				if (typeof path === 'number') {
					newOutputs[(path + this.rotation) % 4] = true;
				} else if (Array.isArray(path)) {
					for (let j = 0; j < path.length; j += 1) {
						newOutputs[(path[j] + this.rotation) % 4] = true;
					}
				}
			}
		}

		// this.logState(newOutputs);

		for (let i = 0; i < this.outputs.length; i += 1) {
			const oldOutput = this.outputs[i];
			const newOutput = newOutputs[i];

			if (oldOutput === true && newOutput === false) {
				this.outputs[i] = false;

				this.removeLine(i as 0 | 1 | 2 | 3);

				if (this.neighbors[i]) {
					this.neighbors[i].interact('remove', (i + 2) % 4);
				}
			} else if (oldOutput === false && newOutput === true) {
				this.outputs[i] = true;

				this.addLine(i as 0 | 1 | 2 | 3);

				if (this.neighbors[i]) {
					this.neighbors[i].interact('add', (i + 2) % 4);
				}
			}
		}

		this.cellElement.classList.toggle('active', this.isActive());
		this.iconElement.classList.toggle('active', this.isActive());
	}

	addLine(direction: 0 | 1 | 2 | 3) {
		const line = el('div.line');

		const lineLength = this.distanceToCenter * 2.8;

		line.style.width = '2px';
		line.style.height = lineLength + 'px';
		line.style.bottom = (this.bottom + this.distanceToCenter) + 'px';
		line.style.left = (this.left + this.distanceToCenter) + 'px';
		line.style.transform = 'rotate(' + 90 * direction + 'deg)';

		// if (direction === 0) {
		// 	line.style.width = '2px';
		// 	line.style.height = lineLength + 'px';
		// 	line.style.bottom = (this.bottom + this.distanceToCenter) + 'px';
		// 	line.style.left = (this.left + this.distanceToCenter) + 'px';
		// } 
		
		// if (direction === 1) {
		// 	line.style.width = lineLength + 'px';
		// 	line.style.height = '2px';
		// 	line.style.bottom = (this.bottom + this.distanceToCenter) + 'px';
		// 	line.style.left = (this.left + this.distanceToCenter) + 'px';
		// }
		
		// if (direction === 2) {
		// 	line.style.width = '2px';
		// 	line.style.height = lineLength + 'px';
		// 	line.style.bottom = (this.bottom + this.distanceToCenter - lineLength) + 'px';
		// 	line.style.left = (this.left + this.distanceToCenter) + 'px';
		// }
		
		// if (direction === 3) {
		// 	line.style.width = lineLength + 'px';
		// 	line.style.height = '2px';
		// 	line.style.bottom = (this.bottom + this.distanceToCenter) + 'px';
		// 	line.style.left = (this.left + this.distanceToCenter - lineLength + 2) + 'px';
		// }

		mount(screens.screens.game, line);

		this.lines[direction] = line;
	}

	removeLine(direction: 0 | 1 | 2 | 3) {
		this.lines[direction]?.remove();
	}

	isActive() {
		return this.inputs.some(input => input);
	}
}
