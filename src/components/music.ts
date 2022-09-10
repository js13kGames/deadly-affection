import { gameContainer, soundToggle } from '../systems/game';
import { state } from '../systems/state';
import { 
	initAudioContext,
	zzfx, 
	zzfxP, 
	zzfxX,
} from '../systems/zzfx';
import { zzfxM } from '../systems/zzfxm';
import { openModal } from './modal';

let musicStarted = false;

export function initMusic() {
	if (state.sound == null) {
		openModal(gameContainer, 'Play with sound?', '', [
			{
				type: 'danger',
				content: 'No',
				onClickCallback: () => {
					state.sound = false;
				},
			}, {
				type: 'primary',
				content: 'Rock ON!',
				onClickCallback: () => {
					state.sound = true;
					if (soundToggle) {
						soundToggle.renderState(state.sound);
					}
				},
			}
		], null);
	}
	
	document.body.onclick = () => {
		if (!musicStarted) {
			musicStarted = true;
			initAudioContext();
    		zzfxP(...music).loop = true;

			if (state.sound) {
				zzfxX!.resume();
			} else {
				zzfxX!.suspend();
			}
		}
	}
}

export function playSound(sound: keyof typeof sounds) {
	if (state.sound && zzfxX != null) {
		zzfx(...sounds[sound]);
	}
}

export const sounds = {
	// switchScreen: [2.05,1,537,.01,.01,.01,,.48,94,-31,-801,.2,.11,,,,.24,.54],
	tap: [1.03,.5,355,,,0,,.71,12,,-752,.03,,,,,,.22,.01],
  rotate: [1.02,.5,1133,,.01,.01,1,1.06,,.3,,,,.1,52,,,.13,.01],
  victory: [1.37,,1133,1,.1,.27,,1.45,-2,,136,.09,.18,.2,,,.1,.83,.13],
};

const volume = 0.5;

export const music = zzfxM([
	[volume,0,43,,,.25,,,,,,,,.1]
],
[
	[
		[0,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33]
	],
	[
		[0,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33]
	]
],[0],50);
