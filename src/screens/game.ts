import { el } from '../helpers/redom';
import { NavigationItem } from '../components/navigation';
import { SVGs } from '../helpers/svgs';
import { Gold } from '../components/gold';

export const gameNavItem: NavigationItem = {
	root: null,
	icon: SVGs.battle,
	color: '#D2042D',
	particleColor: '#fc5f70',
	label: 'BATTLE',
};

export function createGameScreen() {
	const gameScreen = el('div.screen');
	
	new Gold(gameScreen);

	return gameScreen;
}
