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

	if (state.arcadian.image != '') {
		document.documentElement.style.setProperty('--bg', state.arcadian.bg);
		document.documentElement.style.setProperty('--color', state.arcadian.color);
		document.documentElement.style.setProperty('--shadow', state.arcadian.shadow);
	}

	let canvas = document.getElementById('canvas') as HTMLCanvasElement;

	if (canvas) {
		let c = canvas.getContext("2d"),
		w = (canvas.width = window.innerWidth),
		h = (canvas.height = window.innerHeight);

		if (c) {
			class firefly {
				x;
				y;
				s;
				ang;
				v;
				constructor(){
				this.x = Math.random()*w;
				this.y = Math.random()*h;
				this.s = Math.random()*2;
				this.ang = Math.random()*2*Math.PI;
				this.v = this.s*this.s/4;
				}
				move(){
				this.x += this.v*Math.cos(this.ang);
				this.y += this.v*Math.sin(this.ang);
				this.ang += Math.random()*20*Math.PI/180-10*Math.PI/180;
				}
				show(){
					if (c) {
						c.beginPath();
						c.arc(this.x,this.y,this.s,0,2*Math.PI);
						c.fillStyle = state?.arcadian?.color != '' ? state.arcadian.color : "#8be9ff";
						c.fill();
					}
				}
			}
			
			let f: firefly[] = [];
			
			function draw() {
				if(f.length < 100){
				for(let j = 0; j < 10; j++){
				f.push(new firefly());
				}
				}
				//animation
				for(let i = 0; i < f.length; i++){
				f[i].move();
				f[i].show();
				if(f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h){
					f.splice(i,1);
					}
				}
			}
				
		
			function loop() {
				// window.requestAnimFrame(loop);
				if (c) {
					c.clearRect(0, 0, w, h);
				}
				draw();
			}
			
			window.addEventListener("resize", function() {
				(w = canvas.width = window.innerWidth),
				(h = canvas.height = window.innerHeight);
				loop();
			});
			
			loop();
			setInterval(loop, 1000 / 30);	
		}
	}
});

window.addEventListener('beforeunload', function () {
	saveState();
});
