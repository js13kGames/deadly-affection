import { Change } from 'object-observer';
import { observeState, unobserveState } from '../helpers/observers';
import { mount } from '../helpers/redom';
import { Screen, state } from '../systems/state';

export class Screens {
	observerId: number;

	constructor(container: HTMLElement, public screens: { [key in Screen]: HTMLElement }) {
		this.observerId = observeState('screen', this.onChange);

		const screenValues = Object.entries(this.screens);
		screenValues.forEach((screen) => {
			// screen[1].classList.add(screen[0]);
			mount(container, screen[1]);
		});

		this.openScreen(state.screen);
	}

	private onChange = (change: Change) => {
		if (change.type === 'update') {
			this.openScreen(change.value);
			return true;
		}

		return false;
	};

	private openScreen = (newScreen: Screen) => {
		Object.entries(this.screens).forEach((screen) => screen[1].classList.toggle('active', newScreen === screen[0]));
	};

	destroy = () => {
		unobserveState(this.observerId);
	};
}
