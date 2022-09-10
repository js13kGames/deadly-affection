import { getSVGElement } from '../helpers/utilities';
import { Setting, state } from '../systems/state';
import { el, mount } from '../helpers/redom';
import { zzfxX } from '../systems/zzfx';
import { playSound } from './music';
import { screens } from '../systems/game';

export class ToggleSetting {
	root: HTMLElement;

	constructor(
		container: HTMLElement, 
		icon: string, 
		private path: Setting, 
		top: number, 
		right: number
	) {
		this.root = el('div.setting', getSVGElement(icon, '#fff'));
		this.root.style.top = `${top}px`;
		this.root.style.right = `${right}px`;
		console.warn(path);

		mount(container, this.root);

		if (path === 'screen') {
			screens.openScreen('game');
			this.renderState(screens.screen === 'levels', false);
			this.root.onclick = () => {
				playSound('tap');
				screens.openScreen(screens.screen === 'game' ? 'levels' : 'game');
				this.renderState(screens.screen === 'levels');
			};
		} else {
			this.renderState(state[path] as boolean, false);
			this.root.onclick = () => {
				playSound('tap');
				state[path] = !state[path];
				this.renderState(state[path] as boolean);
			};
		}
	}

	public renderState = (newState: boolean, showTooltip = true) => {
		this.root.classList.toggle('active', newState);

		if (this.path === 'sound') {
			if (zzfxX != null) {
				newState ? zzfxX.resume() : zzfxX.suspend();
			}
		}

		if (this.path === 'fullscreen' && showTooltip) {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen().catch((reason) => console.error(reason));
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	};
}
