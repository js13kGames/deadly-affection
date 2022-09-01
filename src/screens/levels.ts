import { EntityCollectable } from './../data/levels';
import { el, mount } from '../helpers/redom';
import { NavigationItem } from '../components/navigation';
import { SVGs } from '../helpers/svgs';
import { levels } from '../data/levels';
import { state } from '../systems/state';
import { getSVGElement } from '../helpers/utilities';
import { playLevel } from '../systems/play';

export const levelsNavItem: NavigationItem = {
	root: null,
	icon: SVGs.levels,
	color: '#cdb422',
	label: 'LEVELS',
};

const levelScreen = el('div.screen');

export function createLevelsScreen() {
	renderLevels();

	return levelScreen;
}

export function renderLevels() {
	levelScreen.innerHTML = '';
	for (let i = 0; i < levels.length; i += 1) {
		const level = levels[i];

		const collectablesInLevel = level[1].filter(entity => entity?.[0] === EntityCollectable).length;
		const collectablesCollected = state.progress[i]?.[1] ?? 0;

		const collectableElements = [];

		for (let j = 0; j < collectablesInLevel; j += 1) {
			const collectableElement = getSVGElement(SVGs.hearts, '#d0021b');

			if (collectablesCollected > j) {
				collectableElement.classList.add('done');
			}

			collectableElements.push(collectableElement);
		}

		const levelContainer = el('div.level', [
			el('b', (i + 1).toString()),
			el('div.hearts', collectableElements),
		]);

		if (state.progress[i]?.[0]) {
			levelContainer.classList.add('done');
		}

		levelContainer.onclick = () => {
			playLevel(i);
		};

		mount(levelScreen, levelContainer);
	}
}
