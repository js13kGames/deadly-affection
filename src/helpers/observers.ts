import { Change, Observable, Observer } from 'object-observer';
import { State } from '../systems/state';

let observableState: Observable & State;

let stateObservers: Observer[] = [];

export function createStateObserver(state: State) {
	if (observableState && Observable.isObservable(observableState)) {
		Observable.unobserve(observableState);
	}

	observableState = Observable.from(state);

	return observableState;
}

export function observeState(path: string, onChange: (change: Change) => boolean): number {
	const observerId =
		stateObservers.push((changes) => {
			for (let i = 0; i < changes.length; i += 1) {
				const isHandledChange = onChange(changes[i]);

				if (isHandledChange === false) {
					console.error(changes[i]);
				}
			}
		}) - 1;

	Observable.observe(observableState, stateObservers[observerId], { 'pathsFrom': path });

	return observerId;
}

export function unobserveState(observerId: number) {
	Observable.unobserve(observableState, stateObservers[observerId]);
}
