import { el } from '../helpers/redom';
import { NavigationItem } from './../components/navigation';
import { SVGs } from './../helpers/svgs';

export const upgradesNavItem: NavigationItem = {
	root: null,
	icon: SVGs.flask,
	color: '#7ed321',
	particleColor: '#9ec679',
	label: 'UPGRADES',
};

export function createUpgradesScreen() {
	return el('div.screen');
}
