import { createStateObserver } from '../helpers/observers';

const localStorageKey = 'deadly-connection';

export type Screen = 'game' | 'levels';
export type Setting = 'sound' | 'fullscreen' | 'screen';

export type State = {
	screen: Screen;
	sound: boolean | null;
	coilTotal: number;
	near: boolean;
	arcadian: {
		color: string;
		shadow: string;
		image: string;
	};
	fullscreen: boolean;
	level: number;
	progress: { [key: number]: [boolean, number] };
};

export const emptyState: State = {
	screen: 'game',
	sound: null,
	coilTotal: 0,
	near: false,
	arcadian: {
		color: '',
		shadow: '',
		image: '',
	},
	fullscreen: document.fullscreenElement != null,
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
