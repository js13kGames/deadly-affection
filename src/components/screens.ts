import { mount } from '../helpers/redom';

export type Screen = 'game' | 'levels';

export class Screens {
	screen: Screen = 'game';

	constructor(container: HTMLElement, public screens: { [key in Screen]: HTMLElement }) {
		const screenValues = Object.entries(this.screens);
		screenValues.forEach((screen) => {
			screen[1].classList.add(screen[0] + '-screen');
			mount(container, screen[1]);
		});

		this.openScreen(this.screen, true);
	}

	public openScreen = (newScreen: Screen, force = false) => {
		if (force === false && this.screen === newScreen) {
			return;
		}

		this.screen = newScreen;

		Object.entries(this.screens).forEach((screen) => screen[1].classList.toggle('active', newScreen === screen[0]));
	};
}
