import { Change } from 'object-observer';
import { getSVGElement } from '../helpers/utilities';
import { observeState, unobserveState } from '../helpers/observers';
import { Setting, state } from '../systems/state';
import { el, mount } from '../helpers/redom';
import { zzfxX } from '../systems/zzfx';
import { floatText } from '../helpers/animations';

export class ToggleSetting {
	observerId: number;

	root: HTMLElement;

	constructor(container: HTMLElement, icon: string, private path: Setting, top: number, right: number) {
		this.root = el('div.setting', getSVGElement(icon, '#fff'));
		this.root.style.top = `${top}px`;
		this.root.style.right = `${right}px`;

		this.observerId = observeState(path, this.onChange);

		mount(container, this.root);

		this.renderState(state[path] as boolean, false);

		this.root.onclick = () => {
			state[path] = !state[path];
			this.renderState(state[path] as boolean);
		};
	}

	private onChange = (change: Change) => {
		if (change.type === 'update') {
			this.renderState(change.value);
			return true;
		}

		return false;
	};

	private renderState = (newState: boolean, showTooltip = true) => {
		this.root.classList.toggle('active', newState);

		if (this.path === 'sound') {
			if (zzfxX != null) {
				newState ? zzfxX.resume() : zzfxX.suspend();
			}
			if (showTooltip) {
				floatText(this.root, `Sound: ${newState ? 'ON' : 'OFF'}`, 4, 40, 500, 500);
			}
		}

		if (this.path === 'fullscreen' && showTooltip) {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen().catch((reason) => console.log(reason));
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			}

			floatText(this.root, `Fullscreen: ${newState ? 'ON' : 'OFF'}`, 4, 40, 500, 500);
		}
	};

	destroy = () => {
		unobserveState(this.observerId);
	};
}
