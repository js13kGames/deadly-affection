import { Rotation } from './../data/levels';

export type PathDirection = Rotation[] | Rotation | null;

export class Base {
	public neighbors!: [Base, Base, Base, Base];

	public paths: [PathDirection, PathDirection, PathDirection, PathDirection] = [null, null, null, null];
	public inputs: [boolean, boolean, boolean, boolean] = [false, false, false, false];
	public outputs: [boolean, boolean, boolean, boolean] = [false, false, false, false];

	constructor(
		public cellKey: string,
		public cellElement: HTMLElement,
		public iconElement: HTMLElement,
		public rotation: number,
		public rotatable = false,
		public withBackground = false,
	) {
		this.cellElement.style.transform = 'rotate(' + (90 * this.rotation) + 'deg)';

		if (this.rotatable) {
			this.cellElement.onclick = () => {
				this.rotation = this.rotation + 1;
				this.cellElement.style.transform = 'rotate(' + (90 * this.rotation) + 'deg)';

				// Move first element to end of array
				const poppedInput = this.inputs.pop();
				this.inputs.unshift(poppedInput ?? false);

				this.interact('add');
			}
		} else {
			this.cellElement.style.pointerEvents = 'none';
		}

		if (this.withBackground === false) {
			this.cellElement.style.background = 'transparent';
		}
	}

	interact(action: 'add' | 'remove', from?: number) {
		if (action === 'remove' && from != null) {
			this.inputs[from] = false;
			from = undefined;
		}

		if (action === 'add' && from != null) {
			this.inputs[from] = true;
			from = undefined;
		}

		// if (from == null) {
			const newOutputs: [boolean, boolean, boolean, boolean] = [false, false, false, false];

			for (let i = 0; i < this.inputs.length; i += 1) {
				const path = this.paths[i];
				if (typeof path === 'number') {
					newOutputs[(path + this.rotation) % 4] = true;
				} else if (Array.isArray(path)) {
					for (let j = 0; j < path.length; j += 1) {
						newOutputs[(path[j] + this.rotation) % 4] = true;
					}
				}
			}

			this.logState(newOutputs);

			for (let i = 0; i < this.outputs.length; i += 1) {
				const oldOutput = this.outputs[i];
				const newOutput = newOutputs[i];

				if (oldOutput === true && newOutput === false) {
					this.outputs[i] = false;

					if (this.neighbors[i]) {
						this.neighbors[i].interact('remove', (i + 2) % 4);
					}
				} else if (oldOutput === false && newOutput === true) {
					this.outputs[i] = true;

					if (this.neighbors[i]) {
						this.neighbors[i].interact('add', (i + 2) % 4);
					}
				}
			}
		// } else {
		// 	console.error('play not implemented - ' + this.cellKey + ' - ' + from);
		// }
	}

	isActive() {
		return this.inputs.some(input => input);
	}

	logState(newOutputs: [boolean, boolean, boolean, boolean]) {
		console.log('========');
		console.log(this.cellKey);
		console.log('--------');
		console.log('•', this.inputs[0] ? '▼' : newOutputs[0] ? '▲' : '•', '•');
		console.log(this.inputs[3] ? '▶' : newOutputs[3] ? '◀' : '•', 'X', this.inputs[1] ? '◀' : newOutputs[1] ? '▶' : '•');
		console.log('•', this.inputs[2] ? '▲' : newOutputs[2] ? '▼' : '•', '•');
		console.log('========');
	}
}
