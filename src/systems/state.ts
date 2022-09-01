import { createStateObserver } from '../helpers/observers';
import { processTime } from './game-loop';

const localStorageKey = 'unknown';

export type Screen = 'game' | 'levels';
export type Setting = 'sound' | 'fullscreen';

export type State = {
	startedAt: number;
	processedAt: number;
	screen: Screen;
	sound: boolean | null;
	coilTotal: number;
	fullscreen: boolean;
	timeWithMusicOn: number;
	level: number;
	progress: { [key: number]: [boolean, number] };
};

export const emptyState: State = {
	startedAt: Date.now(),
	processedAt: Date.now(),
	screen: 'game',
	sound: null,
	coilTotal: 0,
	fullscreen: document.fullscreenElement != null,
	timeWithMusicOn: 0,
	level: 0,
	progress: {},
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
