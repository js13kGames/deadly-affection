import { EntityCollectable } from './../data/levels';
import { el, mount } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { levels } from '../data/levels';
import { state } from '../systems/state';
import { getSVGElement } from '../helpers/utilities';
import { playLevel } from '../systems/play';
import { playSound } from '../components/music';
import { openCoilScreen, openNearScreen } from '../systems/game';

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
			const collectableElement = getSVGElement(SVGs.hearts);

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

		if (i >= 12 && i <= 14) {
			if (state.coilTotal <= 0) {
				levelContainer.classList.add('locked');
			}
		}

		if (i >= 15 && i <= 17) {
			if (!state.near) {
				levelContainer.classList.add('locked');
			}
		}

		levelContainer.onclick = async () => {
			playSound('tap');

			if (i >= 12 && i <= 14) {
				if (state.coilTotal > 0) {
					playLevel(i);
				} else {
					openCoilScreen();
				}
			} else if (i >= 15 && i <= 17) {
				if (state.near) {
					playLevel(i);
				} else {
					await openNearScreen();
				}
			} else {
				playLevel(i);
			}
		};

		mount(levelScreen, levelContainer);

		if (i == 11) {
			mount(levelScreen, el('b.sep', 'Normal'));
		}
		if (i == 14) {
			mount(levelScreen, el('b.sep', 'Coil'));
		}
		if (i == 17) {
			mount(levelScreen, el('b.sep', 'NEAR'));
		}
	}
}
