import { Change } from 'object-observer';
import { getSVGElement } from '../helpers/utilities';
import { SVGs } from '../helpers/svgs';
import { observeState, unobserveState } from '../helpers/observers';
import { state } from '../systems/state';
import { animateNumber } from '../helpers/animations';
import { el, mount } from '../helpers/redom';

export class Gold {
	observerId: number;

	root: HTMLElement;
	amount: HTMLElement;

	constructor(container: HTMLElement) {
		this.amount = el('strong.amount');
		this.root = el('div.gold', [getSVGElement(SVGs.gold, '#FFD700'), this.amount]);

		this.observerId = observeState('gold', this.onChange);

		mount(container, this.root);

		this.renderAmount(state.gold, state.gold);
	}

	private onChange = (change: Change) => {
		if (change.type === 'update') {
			this.renderAmount(change.oldValue, change.value);
			return true;
		}

		return false;
	};

	private renderAmount = (oldAmount: number, newAmount: number) => {
		animateNumber(this.amount, oldAmount, newAmount, false);
	};

	destroy = () => {
		unobserveState(this.observerId);
	};
}
