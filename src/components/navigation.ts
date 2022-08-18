import { Change } from 'object-observer';
import { observeState, unobserveState } from '../helpers/observers';
import { hideBoxShadow, hideGlowEffect, showBoxShadow, showGlowEffect } from '../helpers/particles';
import { el, mount } from '../helpers/redom';
import { getSVGElement } from '../helpers/utilities';
import { Screen, state } from '../systems/state';
import { playSound } from './music';

export type NavigationItem = {
	root: HTMLElement | null;
	iconElement?: HTMLElement;
	label: string;
	color: string;
	particleColor: string;
	icon: string;
};

export class Navigation {
	observerId: number;

	particleId: number | null = null;

	private particles: { [key in Screen]: number | null } = {
		game: null,
		upgrades: null,
		goals: null,
	};

	root: HTMLElement;

	constructor(container: HTMLElement, public items: { [key in Screen]: NavigationItem }) {
		this.observerId = observeState('screen', this.onChange);

		this.root = el('div.navigation');

		const itemValues = Object.entries(this.items);
		itemValues.forEach((entry) => {
			const screen = entry[0] as Screen;
			const item = entry[1];

			item.iconElement = getSVGElement(item.icon, item.color);
			item.iconElement.style.fill = item.color;

			const label = el('strong', item.label);

			item.root = el('div.item');

			mount(item.root, item.iconElement);
			mount(item.root, label);

			item.root.onclick = () => {
				state.screen = screen;
			};

			mount(this.root, item.root);
		});

		mount(container, this.root);

		requestAnimationFrame(() => {
			this.selectNavItem(state.screen);
		});
	}

	private onChange = (change: Change) => {
		if (change.type === 'update') {
			this.selectNavItem(change.value);
			playSound('switchScreen');
			return true;
		}

		return false;
	};

	private selectNavItem = (newScreen: Screen) => {
		const particleId = this.particles[newScreen];
		if (particleId != null) {
			hideGlowEffect(particleId);
			this.particles[newScreen] = null;
		}

		Object.entries(this.items).forEach((item) => {
			if (item[1].root != null) {
				if (item[0] === newScreen) {
					showBoxShadow(item[1].root, 2, item[1].color);
				} else {
					hideBoxShadow(item[1].root);
				}
				item[1].root.classList.toggle('active', item[0] === newScreen);
			}
		});
	};

	glow(screenKey: Screen) {
		if (state.screen === screenKey || this.particles[screenKey] != null) {
			return;
		}

		const item = this.items[screenKey];
		this.particles[screenKey] = showGlowEffect(this.root, item.root!, item.particleColor, 2);
	}

	destroy = () => {
		unobserveState(this.observerId);
	};
}
