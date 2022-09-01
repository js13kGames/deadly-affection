import { el, mount } from './redom';
import { abbreviateNumber } from './utilities';

type EasableAttributes = {
	value?: number;
	x?: number;
	y?: number;
	scale?: number;
	opacity?: number;
};

// TODO: Replace with animejs

const EasingFunctions = {
	// no easing, no acceleration
	linear: (t: number) => t,
	// accelerating from zero velocity
	easeInQuad: (t: number) => t * t,
	// decelerating to zero velocity
	easeOutQuad: (t: number) => t * (2 - t),
	// acceleration until halfway, then deceleration
	easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
	// accelerating from zero velocity
	easeInCubic: (t: number) => t * t * t,
	// decelerating to zero velocity
	easeOutCubic: (t: number) => --t * t * t + 1,
	// acceleration until halfway, then deceleration
	easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
	// accelerating from zero velocity
	easeInQuart: (t: number) => t * t * t * t,
	// decelerating to zero velocity
	easeOutQuart: (t: number) => 1 - (t -= 1) ** 4,
	// acceleration until halfway, then deceleration
	easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
	// accelerating from zero velocity
	easeInQuint: (t: number) => t * t * t * t * t,
	// decelerating to zero velocity
	easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
	// acceleration until halfway, then deceleration
	easeInOutQuint: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),

	easeOutBounce: (t: number) => {
		if (t < 1 / 2.75) {
			return 7.5625 * t * t;
		} else if (t < 2 / 2.75) {
			t -= 1.5 / 2.75;
			return 7.5625 * t * t + 0.75;
		} else if (t < 2.5 / 2.75) {
			t -= 2.25 / 2.75;
			return 7.5625 * t * t + 0.9375;
		} else {
			t -= 2.625 / 2.75;
			return 7.5625 * t * t + 0.984375;
		}
	},

	// export function easeOutBounce(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
	// 	if ((elapsed /= duration) < 1 / 2.75) {
	// 		return amountOfChange * (7.5625 * elapsed * elapsed) + initialValue;
	// 	} else if (elapsed < 2 / 2.75) {
	// 		return amountOfChange * (7.5625 * (elapsed -= 1.5 / 2.75) * elapsed + 0.75) + initialValue;
	// 	} else if (elapsed < 2.5 / 2.75) {
	// 		return amountOfChange * (7.5625 * (elapsed -= 2.25 / 2.75) * elapsed + 0.9375) + initialValue;
	// 	} else {
	// 		return amountOfChange * (7.5625 * (elapsed -= 2.625 / 2.75) * elapsed + 0.984375) + initialValue;
	// 	}
	// }

	// easeInSine: (t: number) => {
	// 	return -t * Math.cos(t * (Math.PI / 2)) + t;
	// },
};

// TODO: Implement these as well

// export function easeInSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return -amountOfChange * Math.cos(t * (Math.PI / 2));
// }

// export function easeInSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return -amountOfChange * Math.cos(elapsed / duration * (Math.PI / 2)) + amountOfChange + initialValue;
// }

// export function easeOutSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return amountOfChange * Math.sin(elapsed / duration * (Math.PI / 2)) + initialValue;
// }

// export function easeInOutSine(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return -amountOfChange / 2 * (Math.cos(Math.PI * elapsed / duration) - 1) + initialValue;
// }

// export function easeInExpo(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return elapsed === 0 ? initialValue : amountOfChange * Math.pow(2, 10 * (elapsed / duration - 1)) + initialValue;
// }

// export function easeOutExpo(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return elapsed === duration
// 		? initialValue + amountOfChange
// 		: amountOfChange * (-Math.pow(2, -10 * elapsed / duration) + 1) + initialValue;
// }

// export function easeInOutExpo(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	if (elapsed === 0) {
// 		return initialValue;
// 	}
// 	if (elapsed === duration) {
// 		return initialValue + amountOfChange;
// 	}
// 	if ((elapsed /= duration / 2) < 1) {
// 		return amountOfChange / 2 * Math.pow(2, 10 * (elapsed - 1)) + initialValue;
// 	}
// 	return amountOfChange / 2 * (-Math.pow(2, -10 * --elapsed) + 2) + initialValue;
// }

// export function easeInCirc(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return -amountOfChange * (Math.sqrt(1 - (elapsed /= duration) * elapsed) - 1) + initialValue;
// }

// export function easeOutCirc(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return amountOfChange * Math.sqrt(1 - (elapsed = elapsed / duration - 1) * elapsed) + initialValue;
// }

// export function easeInOutCirc(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	if ((elapsed /= duration / 2) < 1) {
// 		return -amountOfChange / 2 * (Math.sqrt(1 - elapsed * elapsed) - 1) + initialValue;
// 	}
// 	return amountOfChange / 2 * (Math.sqrt(1 - (elapsed -= 2) * elapsed) + 1) + initialValue;
// }

// export function easeInElastic(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	let s = 1.70158;
// 	let p = 0;
// 	let a = amountOfChange;
// 	if (elapsed === 0) {
// 		return initialValue;
// 	}
// 	if ((elapsed /= duration) === 1) {
// 		return initialValue + amountOfChange;
// 	}
// 	if (!p) {
// 		p = duration * 0.3;
// 	}
// 	if (a < Math.abs(amountOfChange)) {
// 		a = amountOfChange;
// 		s = p / 4;
// 	} else {
// 		s = p / (2 * Math.PI) * Math.asin(amountOfChange / a);
// 	}
// 	return -(a * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - s) * (2 * Math.PI) / p)) + initialValue;
// }

// export function easeOutElastic(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	let s = 1.70158;
// 	let p = 0;
// 	let a = amountOfChange;
// 	if (elapsed === 0) {
// 		return initialValue;
// 	}
// 	if ((elapsed /= duration) === 1) {
// 		return initialValue + amountOfChange;
// 	}
// 	if (!p) {
// 		p = duration * 0.3;
// 	}
// 	if (a < Math.abs(amountOfChange)) {
// 		a = amountOfChange;
// 		s = p / 4;
// 	} else {
// 		s = p / (2 * Math.PI) * Math.asin(amountOfChange / a);
// 	}
// 	return a * Math.pow(2, -10 * elapsed) * Math.sin((elapsed * duration - s) * (2 * Math.PI) / p) + amountOfChange + initialValue;
// }

// export function easeInOutElastic(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	let s = 1.70158;
// 	let p = 0;
// 	let a = amountOfChange;
// 	if (elapsed === 0) {
// 		return initialValue;
// 	}
// 	if ((elapsed /= duration / 2) === 2) {
// 		return initialValue + amountOfChange;
// 	}
// 	if (!p) {
// 		p = duration * (0.3 * 1.5);
// 	}
// 	if (a < Math.abs(amountOfChange)) {
// 		a = amountOfChange;
// 		s = p / 4;
// 	} else {
// 		s = p / (2 * Math.PI) * Math.asin(amountOfChange / a);
// 	}
// 	if (elapsed < 1) {
// 		return -0.5 * (a * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - s) * (2 * Math.PI) / p)) + initialValue;
// 	}
// 	return (
// 		a * Math.pow(2, -10 * (elapsed -= 1)) * Math.sin((elapsed * duration - s) * (2 * Math.PI) / p) * 0.5 + amountOfChange + initialValue
// 	);
// }

// export function easeInBack(elapsed: number, initialValue: number, amountOfChange: number, duration: number, s: number = 1.70158): number {
// 	return amountOfChange * (elapsed /= duration) * elapsed * ((s + 1) * elapsed - s) + initialValue;
// }

// export function easeOutBack(elapsed: number, initialValue: number, amountOfChange: number, duration: number, s: number = 1.70158): number {
// 	return amountOfChange * ((elapsed = elapsed / duration - 1) * elapsed * ((s + 1) * elapsed + s) + 1) + initialValue;
// }

// export function easeInOutBack(
// 	elapsed: number,
// 	initialValue: number,
// 	amountOfChange: number,
// 	duration: number,
// 	s: number = 1.70158
// ): number {
// 	if ((elapsed /= duration / 2) < 1) {
// 		return amountOfChange / 2 * (elapsed * elapsed * (((s *= 1.525) + 1) * elapsed - s)) + initialValue;
// 	}
// 	return amountOfChange / 2 * ((elapsed -= 2) * elapsed * (((s *= 1.525) + 1) * elapsed + s) + 2) + initialValue;
// }

// export function easeInBounce(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	return amountOfChange - easeOutBounce(duration - elapsed, 0, amountOfChange, duration) + initialValue;
// }

// export function easeInOutBounce(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
// 	if (elapsed < duration / 2) {
// 		return easeInBounce(elapsed * 2, 0, amountOfChange, duration) * 0.5 + initialValue;
// 	}
// 	return easeOutBounce(elapsed * 2 - duration, 0, amountOfChange, duration) * 0.5 + amountOfChange * 0.5 + initialValue;
// }

type Tween = {
	target: HTMLElement;
	from: EasableAttributes;
	to: EasableAttributes;
	easing: keyof typeof EasingFunctions;
	duration?: number;
	delay?: number;
	abbreviate?: boolean;
	onUpdate?: (progress: number) => void;
	onComplete?: (target: HTMLElement) => void;
};

type TweenProcess = {
	tween: Tween;
	easing: (t: number) => number;
	apply: (change: number) => void;
	duration: number;
	timeUsed: number;
};

const tweenProcesses: TweenProcess[] = [];

export function tween(tween: Tween) {
	const abbreviate = tween.abbreviate ?? false;

	if (tween.duration == null) {
		tween.duration = 500;
	}
	let easing = EasingFunctions[tween.easing];

	if (tween.delay == null) {
		tween.delay = 0;
	}

	const callbacks: ((change: number) => void)[] = [];

	if (tween.from.value != null && tween.to.value != null) {
		const from = tween.from.value;
		const to = tween.to.value;
		const diff = to - from;

		let currentTextContent: string | null = null;

		callbacks.push((change: number) => {
			const currentValue = Math.floor(from + diff * change);
			const newTextContent = abbreviate ? abbreviateNumber(currentValue) : currentValue.toLocaleString();

			if (currentTextContent !== newTextContent) {
				tween.target.textContent = newTextContent;
				currentTextContent = newTextContent;
			}
		});
	}

	const hasX = tween.from.x != null && tween.to.x != null;
	const hasY = tween.from.y != null && tween.to.y != null;
	const hasScale = tween.from.scale != null && tween.to.scale != null;

	if (hasX || hasY || hasScale) {
		callbacks.push((change: number) => {
			const transforms: string[] = [];

			if (tween.from.x != null && tween.to.x != null) {
				const from = tween.from.x;
				const to = tween.to.x;
				const diff = to - from;

				transforms.push(`translateX(${from + diff * change}px)`);
			}

			if (tween.from.y != null && tween.to.y != null) {
				const from = tween.from.y;
				const to = tween.to.y;
				const diff = to - from;

				transforms.push(`translateY(${from + diff * change}px)`);
			}

			if (tween.from.scale != null && tween.to.scale != null) {
				const from = tween.from.scale;
				const to = tween.to.scale;
				const diff = to - from;

				transforms.push(`scale(${from + diff * change})`);
			}

			tween.target.style.transform = transforms.join(' ');
		});
	}

	if (tween.from.opacity != null && tween.to.opacity != null) {
		const from = tween.from.opacity;
		const to = tween.to.opacity;
		const diff = to - from;

		callbacks.push((change: number) => {
			const currentValue = from + diff * change;
			tween.target.style.opacity = currentValue.toString();
		});
	}

	tweenProcesses.push({
		tween,
		easing,
		apply: (change: number) => {
			callbacks.forEach((callback) => callback(change));
		},
		duration: tween.duration,
		timeUsed: -tween.delay,
	});
}

export function processTweens(time: number) {
	const tweensToRemove: number[] = [];

	for (let i = 0; i < tweenProcesses.length; i += 1) {
		const process = tweenProcesses[i];

		process.timeUsed = Math.min(process.duration, process.timeUsed + time);

		if (process.timeUsed < 0) {
			continue;
		}

		const timeUsedAsFloat = process.timeUsed / process.duration;
		const change = process.easing(timeUsedAsFloat);
		process.apply(change);

		if (typeof process.tween.onUpdate === 'function') {
			process.tween.onUpdate(change);
		}

		if (timeUsedAsFloat >= 1) {
			tweensToRemove.push(i);

			if (typeof process.tween.onComplete === 'function') {
				process.tween.onComplete(process.tween.target);
			}
		}
	}

	for (let i = tweensToRemove.length - 1; i >= 0; i -= 1) {
		tweenProcesses.splice(tweensToRemove[i], 1);
	}
}

export function floatText(container: HTMLElement, content: string, top: number, right: number, delay = 0, duration = 800) {
	const text = el('b.float', content);

	text.style.top = `${top}px`;
	text.style.right = `${right}px`;

	mount(container, text);

	tween({
		target: text,
		delay,
		from: { y: 0 },
		to: { y: -60 },
		easing: 'linear',
		duration: duration + 200,
		onComplete: () => {
			setTimeout(() => {
				text.remove();
			}, 1000);
		}
	});

	tween({
		target: text,
		delay,
		from: { opacity: 1 },
		to: { opacity: 0 },
		easing: 'linear',
		duration,
	});
}
