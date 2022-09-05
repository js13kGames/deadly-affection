import { Button } from './../components/button';
import { LinkSetting } from '../components/link-setting';
import { openModal } from '../components/modal';
import { Screens } from '../components/screens';
import { ToggleSetting } from '../components/toggle-setting';
import { el, mount } from '../helpers/redom';
import { SVGs } from '../helpers/svgs';
import { createGameScreen } from '../screens/game';
import { createLevelsScreen } from '../screens/levels';
import { buyItem, getBoughtItems, isLoggedInWithNEAR, loginWithNEAR, logoutWithNEAR, walletConnection } from './near';
import { getCoilEarnings } from './coil';
import { randomIntFromInterval } from '../helpers/utilities';
import { state } from './state';
import { playLevel } from './play';

export let gameContainer: HTMLElement;

export let screens: Screens;

function toggleCoilEarning(coilEarningContainer: HTMLElement) {
	if (getCoilEarnings() !== '0 USD') {
		coilEarningContainer.style.display = 'inherit';
	} else {
		coilEarningContainer.style.display = 'none';
	}
}

export function openCoilScreen() {
	const coilEarnings = el('b', getCoilEarnings());

	const coilEarningContainer = el('p', [el('span', 'Thanks for '), coilEarnings]);
	toggleCoilEarning(coilEarningContainer);

	const coilEarningInterval = setInterval(() => {
		coilEarnings.textContent = getCoilEarnings();
		toggleCoilEarning(coilEarningContainer);
	}, 500);

	openModal(gameContainer, 'Coil', [
		el('p', 'Access 3 extra levels with Coil!'),
		coilEarningContainer,
	], [{
		type: 'normal',
		content: 'Close',
		onClickCallback: () => {},
	}, {
		type: 'primary',
		content: 'Get Coil',
		onClickCallback: () => { window.open('https://coil.com', '_blank')?.focus() },
	}], () => {
		clearInterval(coilEarningInterval);
	});
}

export async function openNearScreen() {
	{
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
				nearContent.push(el('b.sep', 'Your Purchases'));

				items.forEach((item: any) => {
					const itemPurchaseDate = (new Date(item.purchasedAt / 1000000));

					nearContent.push(el('small', [
						el('b', item.item),
						el('i', ' - ' + window.nearApi.utils.format.formatNearAmount(item.amount) + ' NEAR'),
						el('i', ' - ' + itemPurchaseDate.toLocaleString()),
					]))
				});
			} else {
				nearContent.push(el('p', 'Buy levels or tip me to see your purchases here!'));
			}

			const levelsBought = items.find((item: any) => item.item === 'levels');

			nearButtons = [{
				type: levelsBought ? 'primary' : 'normal',
				content: 'Tip',
				onClickCallback: () => {
					buyItem('tip', 1);
				},
			}];

			if (!levelsBought) {
				nearButtons.push({
					type: 'primary',
					content: 'Buy Levels',
					onClickCallback: () => {
						buyItem('levels', 1);
					},
				});
			}

			nearButtons.push({
				type: 'danger',
				content: 'Logout',
				onClickCallback: logoutWithNEAR,
			});
		} else {
			nearContent.push(el('p', 'Login to access your purchases!'));
		}

		openModal(gameContainer, 'NEAR', nearContent, nearButtons, null);
	}
}

function getAverageRGB(imgEl: HTMLImageElement) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}

export async function openArcadiaScreen() {
	const arcadianContainer = el('div.arcadians'); // arcadians.length > 0 ? el(, arcadians) : el('b', 'Failed to load Arcadians :(');
	const loading = el('b.sep', 'loading');
	
	const modal = openModal(gameContainer, 'Arcadia', [
		el('p', 'Pick an Arcadian!'),
		loading,
		arcadianContainer,
	], [{
		type: 'danger',
		content: 'Reset',
		onClickCallback: () => {
			state.arcadian = {
				color: '',
				shadow: '',
				image: '',
			};

			playLevel(state.level);
			state.screen = 'game';
		},
	}, {
		type: 'normal',
		content: 'Close',
		onClickCallback: () => {},
	}, {
		type: 'primary',
		content: 'Refresh',
		onClickCallback: () => {
			openArcadiaScreen();
		},
	}], () => {});

	for (let i = 0; i < 9; i += 1) {
		const arcadian = await (await fetch('https://api.arcadians.io/' + randomIntFromInterval(1, 3000))).json();

		if (arcadian?.image) {
			let blob = await fetch(arcadian.image).then(r => r.blob());
			let dataUrl: string = await new Promise(resolve => 
			{
				let reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			});

			const arcadianImage = el('img') as HTMLImageElement;
			arcadianImage.onload = () => {
				const colorValues = getAverageRGB(arcadianImage);
				const color = 'rgb(' + (Math.min(255, colorValues.r + 75)) + ',' + (Math.min(255, colorValues.g + 75)) + ',' + (Math.min(255, colorValues.b + 75)) + ')';
				const shadow = 'rgb(' + (Math.min(255, colorValues.r + 25)) + ',' + (Math.min(255, colorValues.g + 25)) + ',' + (Math.min(255, colorValues.b + 25)) + ')';
				
				arcadianImage.style.borderColor = color;
				arcadianImage.style.boxShadow = '0 0 3px ' + shadow + ', 0 0 6px ' + shadow + ', 0 0 9px ' + shadow;
				
				arcadianImage.onclick = () => {
					state.arcadian = {
						color,
						shadow,
						image: dataUrl,
					};

					playLevel(state.level);
					state.screen = 'game';

					modal.remove()
				}

				if (i == 8) {
					loading.remove();
				}
			};
			arcadianImage.src = dataUrl;
			mount(arcadianContainer, arcadianImage);
		}
	}
}

export function initGame() {
	gameContainer = el('div.game');

	new LinkSetting(gameContainer, SVGs.discord, '#5865F2', 4, 360, 'https://discord.gg/kPf8XwNuZT');
	new LinkSetting(gameContainer, SVGs.coffee, '#FBAA19', 40, 360, 'https://ko-fi.com/martintale?ref=deadly-connection');

	new LinkSetting(gameContainer, SVGs.near, '#FFFFFF', 76, 360, openNearScreen);
	new LinkSetting(gameContainer, SVGs.coil, '#FFFFFF', 112, 360, openCoilScreen);
	new LinkSetting(gameContainer, SVGs.joystick, '#ff3ed9', 148, 360, openArcadiaScreen);

	new ToggleSetting(gameContainer, SVGs.sound, 'sound', 4, 4);
	new ToggleSetting(gameContainer, SVGs.fullscreen, 'fullscreen', 40, 4);
	new ToggleSetting(gameContainer, SVGs.levels, 'screen', 76, 4);
	
	screens = new Screens(gameContainer, {
		levels: createLevelsScreen(),
		game: createGameScreen(),
	});

	mount(document.body, gameContainer);

	globalThis.onresize = resizeGame;
	resizeGame();

	// TODO: Check highlights on mobile and desktop
}

export function getScale() {
	return Math.min(globalThis.innerWidth / 400, globalThis.innerHeight / 600);
}

function resizeGame() {
	gameContainer.style.transform = `scale(${getScale()})`;
}
