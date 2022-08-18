import { createStateObserver } from '../helpers/observers';
import { processTime } from './game-loop';

const localStorageKey = 'unknown';

export type Screen = 'game' | 'upgrades' | 'goals';
export type Setting = 'sound' | 'particles' | 'fullscreen';

export type State = {
	startedAt: number;
	processedAt: number;
	gold: number;
	screen: Screen;
	sound: boolean | null;
	coilTotal: number;
	particles: boolean;
	fullscreen: boolean;
	timeWithMusicOn: number;
	goals: boolean[];
};

export const emptyState: State = {
	startedAt: Date.now(),
	processedAt: Date.now(),
	gold: 0,
	screen: 'game',
	sound: null,
	coilTotal: 0,
	particles: true,
	fullscreen: document.fullscreenElement != null,
	timeWithMusicOn: 0,
	goals: [],
};

export let state: State;

export function initGameState() {
	const savedState = loadState();
	state = createStateObserver(savedState);

	state.fullscreen = document.fullscreenElement != null;
	document.onfullscreenchange = () => {
		state.fullscreen = document.fullscreenElement != null;
	}

	processTime(Date.now() - state.processedAt);

	setInterval(saveState, 5000);
}

export function loadState() {
	const savedState = localStorage.getItem(localStorageKey);

	if (savedState) {
		return Object.assign({ ...emptyState }, JSON.parse(savedState));
	}

	return { ...emptyState };
}

export function saveState() {
	localStorage.setItem(localStorageKey, JSON.stringify(state));
}

export function restartGame() {
	state = emptyState;
	saveState();
}
