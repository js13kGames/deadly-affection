import { Button } from './../components/button';
import { LinkSetting } from '../components/link-setting';
import { openModal } from '../components/modal';
import { Navigation } from '../components/navigation';
import { Screens } from '../components/screens';
import { ToggleSetting } from '../components/toggle-setting';
import { floatText } from '../helpers/animations';
import { el, mount } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { randomIntFromInterval } from '../helpers/utilities';
import { createGameScreen, gameNavItem } from '../screens/game';
import { createLevelsScreen, levelsNavItem } from '../screens/levels';
import { buyItem, getBoughtItems, isLoggedInWithNEAR, loginWithNEAR, logoutWithNEAR, walletConnection } from './near';
import { getCoilEarnings } from './coil';
import { playLevel } from './play';

export let gameContainer: HTMLElement;

export let screens: Screens;
export let navigation: Navigation;

export function initGame() {
	gameContainer = el('div.game');

	new LinkSetting(gameContainer, SVGs.discord, '#5865F2', 4, 360, 'https://discord.gg/kPf8XwNuZT');
	new LinkSetting(gameContainer, SVGs.coffee, '#FBAA19', 40, 360, 'https://ko-fi.com/martintale?ref=unknown');

	new LinkSetting(gameContainer, SVGs.near, '#FFFFFF', 76, 360, async () => {
		let nearButtons: Button[] = [{
			type: 'primary',
			content: 'Login',
			onClickCallback: loginWithNEAR,
		}];

		const nearContent = [];

		if (isLoggedInWithNEAR()) {
			const nearBalance = parseFloat(window.nearApi.utils.format.formatNearAmount((await walletConnection.account().getAccountBalance()).available)).toFixed(2);
			nearContent.push(el('p', [el('span', 'You have '), el('b', nearBalance + ' NEAR')]));

			const items = await getBoughtItems();

			if (items.length > 0) {
				nearContent.push(el('b', 'Your Purchases'));

				items.forEach((item: any) => {
					const itemPurchaseDate = (new Date(item.purchasedAt / 1000000));

					nearContent.push(el('small', [
						el('b', item.item),
						el('span', ' - ' + window.nearApi.utils.format.formatNearAmount(item.amount) + ' NEAR'),
						el('span', ' - ' + itemPurchaseDate.toLocaleString()),
					]))

					console.log(Date.now());
					console.log(item.purchasedAt);
					console.log()
				});
			} else {
				nearContent.push(el('p', 'Buy items in game or tip me below to see your purchases here!'));
			}


			nearButtons = [{
				type: 'primary',
				content: 'Tip 1 NEAR',
				onClickCallback: () => {
					buyItem('tip', 1);
				},
			}, {
				type: 'danger',
				content: 'Logout',
				onClickCallback: logoutWithNEAR,
			}];
		} else {
			nearContent.push(el('p', 'Make and access your purchases!'));
		}

		openModal(gameContainer, 'NEAR', nearContent, nearButtons, null);
	});

	new LinkSetting(gameContainer, SVGs.coil, '#FFFFFF', 112, 360, () => {
		const coilEarnings = el('b', getCoilEarnings());

		const coilEarningInterval = setInterval(() => {
			coilEarnings.textContent = getCoilEarnings();
		}, 500);

		openModal(gameContainer, 'Coil', [
			el('p', 'Bonus multiplier if web monetization is enabled!'),
			el('p', [el('span', 'Thanks for '), coilEarnings]),
		], [{
			type: 'primary',
			content: 'Tip $0.5',
			onClickCallback: () => { console.log('tipping 0.5 dollars')},
		}], () => {
			clearInterval(coilEarningInterval);
		});
	});

	new ToggleSetting(gameContainer, SVGs.sound, 'sound', 4, 4);
	new ToggleSetting(gameContainer, SVGs.fullscreen, 'fullscreen', 40, 4);




	screens = new Screens(gameContainer, {
		levels: createLevelsScreen(),
		game: createGameScreen(),
	});

	navigation = new Navigation(gameContainer, {
		levels: levelsNavItem,
		game: gameNavItem,
	});

	mount(document.body, gameContainer);

	globalThis.onresize = resizeGame;
	resizeGame();

	// TODO: Delete below

	setInterval(() => {
		floatText(
			gameContainer,
			randomIntFromInterval(0, 1000).toString(),
			randomIntFromInterval(50, 200),
			randomIntFromInterval(20, 350)
		);
	}, 5000);

	// TODO: Check highlights on mobile and desktop
}

export function getScale() {
	return Math.min(globalThis.innerWidth / 400, globalThis.innerHeight / 600);
}

function resizeGame() {
	gameContainer.style.transform = `scale(${getScale()})`;
}
