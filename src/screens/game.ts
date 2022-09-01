import { el } from '../helpers/redom';
import { NavigationItem } from '../components/navigation';
import { SVGs } from '../helpers/svgs';

export const gameNavItem: NavigationItem = {
	root: null,
	icon: SVGs.play,
	color: '#4d85b9',
	label: 'PLAY',
};

export function createGameScreen() {
	const gameScreen = el('div.screen');

	return gameScreen;
}
