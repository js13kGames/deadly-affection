import { initGame } from './systems/game';
import { initGameLoop } from './systems/game-loop';
import { initGameState, saveState } from './systems/state';
import { initMusic } from './components/music';
import { initNEAR } from './systems/near';
import { initCoil } from './systems/coil';

window.addEventListener('DOMContentLoaded', () => {
	initGameState();
	initNEAR();
	initCoil();
	initGame();
	initGameLoop();
	initMusic();
});

window.addEventListener('beforeunload', function () {
	saveState();
});
