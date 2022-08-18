import { state, State } from './../systems/state';
import { el, mount } from '../helpers/redom';
import { NavigationItem } from '../components/navigation';
import { SVGs } from '../helpers/svgs';
import { getSVGElement } from '../helpers/utilities';
import { openModal } from '../components/modal';
import { hideGlowEffect, showBoxShadow, showGlowEffect } from '../helpers/particles';
import { observeState } from '../helpers/observers';
import { navigation } from '../systems/game';

export type Goal = {
	path: keyof State;
	icon: keyof typeof SVGs;
	name: string;
	description: string;
	requirement: number;
	secret: boolean;
	color?: string;
	particleId?: number;
};

const goals: Goal[] = [
	{ path: 'gold', icon: 'gold', name: 'Gold T1', description: 'Have 1k gold', requirement: 1000, secret: false },
	{ path: 'gold', icon: 'gold', name: 'Gold T2', description: 'Have 10k gold', requirement: 10000, secret: false },
	{ path: 'gold', icon: 'gold', name: 'Gold T3', description: 'Have 100k gold', requirement: 100000, secret: false },
	{ path: 'gold', icon: 'gold', name: 'Gold T4', description: 'Have 1m gold', requirement: 1000000, secret: false },
	{ path: 'gold', icon: 'gold', name: 'Gold T5', description: 'Have 10m gold', requirement: 10000000, secret: false },
	{
		path: 'timeWithMusicOn',
		icon: 'sound',
		name: "That's my JAM!",
		description: 'Play with sound on for 1 minute',
		requirement: 60000,
		secret: true,
	},
];

const colors = ['#fff', '#619663', '#4d84b9', '#8c458c', '#ce9938', '#ff6280'];

export const goalsNavItem: NavigationItem = {
	root: null,
	icon: SVGs.trophy,
	color: '#FFD700',
	particleColor: '#ffffe9',
	label: 'GOALS',
};

type GoalCategory = {
	colorIterator: number;
	goalIndexes: number[];
};

const goalElements: HTMLElement[] = [];
const goalCategories: { [key: string]: GoalCategory } = {};

export function createGoalsScreen() {
	const goalScreen = el('div.screen');
	const items = el('div.goals');

	mount(items, el('h1', 'Goals'));

	goals.forEach((goal, index) => {
		if (goalCategories[goal.path] == null) {
			goalCategories[goal.path] = {
				colorIterator: goal.secret ? 5 : 0,
				goalIndexes: [],
			};
		}

		goalCategories[goal.path].goalIndexes.push(index);

		const color = colors[goalCategories[goal.path].colorIterator];

		goals[index].color = color;

		const goalElement = el('div.goal', getSVGElement(SVGs[goal.icon], color));

		goalCategories[goal.path].colorIterator += 1;

		if (state.goals[index] == null) {
			state.goals[index] = false;
		}

		if (state.goals[index]) {
			goalElement.classList.add('complete');
			showBoxShadow(goalElement, 2, color);
		}

		goalElement.onclick = () => {
			const description = goal.secret && !state.goals[index] ? '???' : goal.description;

			if (goal.particleId != null) {
				hideGlowEffect(goal.particleId);
				goal.particleId = undefined;
			}

			const modalIcon = getSVGElement(SVGs[goal.icon], color);
			modalIcon.style.width = '50px';

			openModal(
				goalScreen,
				[modalIcon, el('b', goal.name)],
				description,
				[
					{
						type: 'normal',
						content: 'Close',
						onClickCallback: null,
					},
				],
				null
			);
		};
		goalElement.onpointerover = () => {
			if (goal.particleId != null) {
				hideGlowEffect(goal.particleId);
				goal.particleId = undefined;
			}
		};

		goalElements.push(goalElement);

		mount(items, goalElement);
	});

	Object.entries(goalCategories).forEach((category) => {
		const path = category[0] as keyof State;

		observeState(path, (change) => {
			if (change.type === 'update') {
				const incompleteGoals = category[1].goalIndexes.filter((index) => !state.goals[index]);

				incompleteGoals.forEach((index) => {
					const goal = goals[index];
					const currentValue = state[path];

					if (currentValue != null && goal.requirement <= currentValue) {
						state.goals[index] = true;

						if (goal.color) {
							goal.particleId = showGlowEffect(items, goalElements[index], goal.color, 2, 5);
							showBoxShadow(goalElements[index], 2, goal.color);
						}

						goalElements[index].classList.add('complete');

						navigation.glow('goals');
					}
				});

				return true;
			}

			return false;
		});
	});

	mount(goalScreen, items);

	return goalScreen;
}
