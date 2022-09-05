import { initGame } from './systems/game';
import { initGameState, saveState, state } from './systems/state';
import { initMusic } from './components/music';
import { initNEAR } from './systems/near';
import { initCoil } from './systems/coil';
import { playLevel } from './systems/play';

window.addEventListener('DOMContentLoaded', () => {
	initGameState();
	initNEAR();
	initCoil();
	initGame();
	initMusic();

	playLevel(state.level);
});

window.addEventListener('beforeunload', function () {
	saveState();
});
