import { processTweens } from '../helpers/animations';
import { state } from './state';

let lastTweenedTimestamp = 0;
let lastProcessedTimestamp = 0;

export function initGameLoop() {
	requestAnimationFrame(onFrameStep);
}

export const onFrameStep = (timestamp: number) => {
	const timeToProcess = timestamp - lastProcessedTimestamp;

	if (timeToProcess > 1000) {
		processTime(timeToProcess);
		lastProcessedTimestamp = timestamp;
	}

	const timeToTween = timestamp - lastTweenedTimestamp;
	processTweens(timeToTween);
	lastTweenedTimestamp = timestamp;

	requestAnimationFrame(onFrameStep);
};

export function processTime(time: number) {
	time = Math.max(0, time);

	state.processedAt += time;

	if (state.sound) {
		state.timeWithMusicOn += time;
	}
}
