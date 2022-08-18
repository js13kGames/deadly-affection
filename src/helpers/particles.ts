import { state } from '../systems/state';
import { tween } from './animations';
import { el, mount } from './redom';
import { randomIntFromInterval } from './utilities';

type Effect = {
	root: HTMLElement;
	target: HTMLElement;
	active: boolean;
	animationCallbacks: (() => void)[];
};

export const effects: (Effect | null)[] = [];

export function showBoxShadow(target: HTMLElement, particleSize: number, color: string) {
	target.style.boxShadow = `0 0 ${particleSize}px ${color}, 0 0 ${particleSize * 2}px ${color}, 0 0 ${particleSize * 3}px ${color}`
}

export function hideBoxShadow(target: HTMLElement) {
	target.style.boxShadow = '';
}

export function showGlowEffect(
	container: HTMLElement,
	target: HTMLElement,
	color: string = '#fff',
	particleSize = 2,
	edgeSize = 4,
) {
	const effectId = effects.length;
	const effect = {
		root: el('div.particles'),
		target: target,
		active: state.particles,
		animationCallbacks: [] as (() => void)[],
	};
	
	effects.push(effect);
	
	target.style.zIndex = '1';

	effect.root.style.top = target.offsetTop + 'px';
	effect.root.style.left = target.offsetLeft + 'px';
	effect.root.style.width = target.offsetWidth + 'px';
	effect.root.style.height = target.offsetHeight + 'px';
	effect.root.style.zIndex = '0';

	const topParticleCount = Math.floor((target.offsetWidth - edgeSize * 2) / particleSize
	);

	for (let i = 0; i < topParticleCount; i += 1) {
		const particle = createParticle(effect.root, edgeSize + i * particleSize, particleSize + 1, color, particleSize);
		effect.animationCallbacks.push(() => {
			animateDust(effectId, particle, -particleSize * 3, particleSize * 3, particleSize);
		});
	}

	const sideParticleCount = Math.floor((target.offsetHeight - edgeSize * 2) / particleSize
	);
	for (let i = 0; i < sideParticleCount; i += 1) {
		const leftParticle = createParticle(effect.root, particleSize + 1, edgeSize + i * particleSize, color, particleSize);
		effect.animationCallbacks.push(() => {
			animateDust(effectId, leftParticle, -particleSize * 7, -particleSize * 5, particleSize);
		});

		const rightParticle = createParticle(effect.root, target.offsetWidth - particleSize - 1, edgeSize + i * particleSize, color, particleSize);
		effect.animationCallbacks.push(() => {
			animateDust(effectId, rightParticle, particleSize * 5, particleSize * 7, particleSize);
		});
	}

	mount(container, effect.root);

	if (state.particles) {
		effect.animationCallbacks.forEach(animate => animate());
	}

	return effectId;
}

function animateDust(id: number, particle: HTMLElement, diviationLeft = -5, diviationRight = 5, particleSize = 2) {
	const effect = effects[id];

	tween({
		target: particle,
		delay: randomIntFromInterval(-2000, 2000),
		from: { x: 0, y: 0, opacity: 0.75 },
		to: { x: randomIntFromInterval(diviationLeft, diviationRight), y: -particleSize * 7, opacity: 0 },
		easing: 'easeInCubic',
		duration: 2000,
		onComplete: () => {
			if (effect && effect.active) {
				setTimeout(() => {
					animateDust(id, particle, diviationLeft, diviationRight);
				}, 100);
			}
		}
	});
}

export function hideGlowEffect(id: number) {
	const effect = effects[id];
	if (effect == null) {
		return;
	}

	effect.active = false;
	effect.root.style.opacity = '0';
	setTimeout(() => {
		effect.root.remove();
		effects[id] = null;
	}, 2000);
}

function createParticle(container: HTMLElement, x: number, y: number, color: string, size = 1) {
	const particle = el('div.particle');

	particle.style.left = `${x}px`;
	particle.style.top = `${y}px`;
	particle.style.width = `${size}px`;
	particle.style.height = `${size}px`;
	particle.style.background = color;
	particle.style.boxShadow = `0 0 ${Math.ceil(size * 0.2)} ${color}`;

	mount(container, particle);

	return particle;
}
