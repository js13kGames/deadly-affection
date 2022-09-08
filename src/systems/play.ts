import { Button } from './../components/button';
import { Entity, EntityCollectable, EntityStart, levels } from '../data/levels';
import { el, mount } from '../helpers/redom';
import { screens, gameContainer } from './game';
import { state } from './state';
import { Block } from '../entities/block';
import { Start } from '../entities/start';
import { End } from '../entities/end';
import { Empty } from '../entities/empty';
import { Base } from '../entities/base';
import { Split } from '../entities/split';
import { TurnOneSide } from '../entities/turn-one-side';
import { TurnTwoSides } from '../entities/turn-two-sides';
import { Tunnel } from '../entities/tunnel';
import { Collectable } from '../entities/collectable';
import { renderLevels } from '../screens/levels';
import { openModal } from '../components/modal';
import { playSound } from '../components/music';
import { getSVGElement } from '../helpers/utilities';
import { SVGs } from '../helpers/svgs';

const entities = [
	Block,
	Start,
	End,
	TurnOneSide,
	TurnTwoSides,
	Split,
	Tunnel,
	Collectable,
];

export let cells: { [key: string]: Empty | Block | Start | End | TurnOneSide };

export function playLevel(level: number) {
	cells = {};
	screens.screens.game.innerHTML = '';
	state.level = level;

	const currentLevel = levels[level];
	const boardWidth = currentLevel[0][0];
	const boardHeight = currentLevel[0][1];

	// 370 width - 70 extra padding = 300
	const possibleCellSizeBasedOnWidth = 300 / boardWidth;
	// 500 width - 10 extra padding = 490
	const possibleCellSizeBasedOnHeight = 470 / boardHeight;

	const cellSize = Math.min(possibleCellSizeBasedOnWidth, possibleCellSizeBasedOnHeight);
	const cellMargin = cellSize * 0.1;

	const widthPadding = (300 - (cellSize - cellMargin) * boardWidth) / 2;
	const heightPadding = 0; // (400 - (cellSize - cellMargin) * boardHeight) / 2;

	let startCells = [];

	for (let i = 0; i < currentLevel[1].length; i += 1) {
		const x = i % boardWidth;
		const y = Math.floor(i / boardWidth);
		const cell = currentLevel[1][i];

		cells[x + '-' + y] = createEntity(cell, x + '-' + y);

		if (cell?.[0] === EntityStart) {
			startCells.push(x + '-' + y);
		}

		const cellValue = cells[x + '-' + y];

		const bottom = 50 + heightPadding + (boardHeight - y) + (boardHeight - y - 1) * cellSize;
		const left = 50 + widthPadding + x * cellSize;

		cells[x + '-' + y].bottom = bottom;
		cells[x + '-' + y].left = left;
		cells[x + '-' + y].distanceToCenter = (cellSize - cellMargin * 2) * 0.5 - 1;
		
		if (cellValue?.cellElement) {
			setCellSizeAndPosition(
				cellValue.cellElement,
				cellSize - cellMargin * 2,
				bottom,
				left,
			);

			mount(screens.screens.game, cells[x + '-' + y]!.cellElement);
		}

		if (cellValue?.iconElement) {
			let padding = 0;

			if (cellValue.name !== 'start' || state.arcadian.image === '') {
				padding = (cellSize - cellMargin * 2) * 0.2;
			}

			setCellSizeAndPosition(
				cellValue.iconElement,
				cellSize - cellMargin * 2 - padding * 2,
				padding + bottom,
				padding + left,
			);

			mount(screens.screens.game, cells[x + '-' + y]!.iconElement);
		}
	}

	for (let i = 0; i < currentLevel[1].length; i += 1) {
		const x = i % boardWidth;
		const y = Math.floor(i / boardWidth);

		cells[x + '-' + y].neighbors = getNeighboringCells(x, y);
	}

	startCells.forEach((cellKey) => {
		cells[cellKey].interact('add');
	});
	processPuzzleProgress();

	state.screen = 'game';
	state.level = level;
}

function createEntity(entity: Entity, cellKey: string) {
	if (entity) {
		const classObject = entities[entity[0]];
		if (classObject != null) {
			return new classObject(entity[1], cellKey, entity[2]);
		}
	}

	return new Empty(0, cellKey);
}

function getNeighboringCells(x: number, y: number): [Base, Base, Base, Base] {
	return [
		cells[x + '-' + (y - 1)],
		cells[(x + 1) + '-' + y],
		cells[x + '-' + (y + 1)],
		cells[(x - 1) + '-' + y],
	];
}

function setCellSizeAndPosition(cellElement: HTMLElement, size: number, bottom: number, left: number) {
	cellElement.style.width = Math.floor(size) + 'px';
	cellElement.style.height = Math.floor(size) + 'px';
	cellElement.style.bottom = Math.floor(bottom) + 'px';
	cellElement.style.left = Math.floor(left) + 'px';
}

export function processPuzzleProgress() {
	updateTutorial();

	const cellValues = Object.values(cells);
	
	const ends = cellValues.filter(cell => cell.name === 'end');

	if (ends.every(end => end.isActive())) {
		cellValues.forEach(cell => cell.cellElement.style.pointerEvents = 'none')
		const collectables = cellValues.filter(cell => cell.name === 'collectable');

		let activeCollectables = 0;
		collectables.forEach(collectable => {
			if (collectable.isActive()) {
				activeCollectables += 1;
			}
		});

		// TODO: Don't overwrite collectables
		state.progress[state.level] = [true, activeCollectables];

		renderLevels();

		let goToLevels = true;

		const buttons: Button[] = [
			{
				content: 'Levels',
				type: 'normal',
				onClickCallback: () => {
					state.screen = 'levels';
				},
			},
			{
				content: 'Replay',
				type: 'normal',
				onClickCallback: () => {
					playLevel(state.level);
					goToLevels = false;
				},
			},
		];

		if (state.level < levels.length - 1) {
			buttons.push({
				content: 'Next',
				type: 'primary',
				onClickCallback: () => {
					playLevel(state.level + 1);
					goToLevels = false;
				}
			});
		}

		const collectableElements: HTMLElement[] = [];

		const level = levels[state.level];
		const collectablesInLevel = level[1].filter(entity => entity?.[0] === EntityCollectable).length;

		for (let j = 0; j < collectablesInLevel; j += 1) {
			const collectableElement = getSVGElement(SVGs.hearts);

			collectableElements.push(collectableElement);
		}

		setTimeout(() => {
			playSound('victory');
			openModal(gameContainer, 'You Won!', el('div.hearts', collectableElements), buttons, () => {
				if (goToLevels) {
					state.screen = 'levels';
				}
			});

			for (let j = 0; j < collectableElements.length; j += 1) {
				if (activeCollectables > j) {
					setTimeout(() => {
						collectableElements[j].classList.add('done');
					}, 500 + j * 200);
				}
			}
		}, 1000);
	}
}

function updateTutorial() {
	if (state.level !== 0) {
		return;
	}

	const firstCell = cells['0-4'];
	const firstElementIncorrect = firstCell.outputs[0] === false;
	firstCell.cellElement.classList.toggle('tutorial', firstElementIncorrect);

	const secondCell = cells['0-0'];
	const secondElementIncorrect = firstElementIncorrect === false && secondCell.outputs[1] === false;
	secondCell.cellElement.classList.toggle('tutorial', secondElementIncorrect);
}
