import { Entity, EntityStart, levels } from '../data/levels';
import { mount } from '../helpers/redom';
import { screens } from './game';
import { state } from './state';
import { Block } from '../entities/block';
import { Start } from '../entities/start';
import { End } from '../entities/end';
import { Empty } from '../entities/empty';
import { Base } from '../entities/base';
import { TurnOneSide } from '../entities/turn-one-side';
import { Collectable } from '../entities/collectable';

const entities = [
	Block,
	Start,
	End,
	TurnOneSide,
	null,
	null,
	null,
	null,
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
	const possibleCellSizeBasedOnHeight = 430 / boardHeight;

	const cellSize = Math.min(possibleCellSizeBasedOnWidth, possibleCellSizeBasedOnHeight);
	const cellMargin = cellSize * 0.1;

	let startCell;

	for (let i = 0; i < currentLevel[1].length; i += 1) {
		const x = i % boardWidth;
		const y = Math.floor(i / boardWidth);
		const cell = currentLevel[1][i];

		cells[x + '-' + y] = createEntity(cell, x + '-' + y);

		if (cell?.[0] === EntityStart) {
			startCell = x + '-' + y;
		}

		if (cell) {
			const cellValue = cells[x + '-' + y];

			if (cellValue?.cellElement) {
				setCellSizeAndPosition(
					cellValue.cellElement,
					cellSize - cellMargin * 2,
					20 + (boardHeight - y) * cellMargin + (boardHeight - y - 1) * cellSize,
					50 + x * cellSize,
				);

				mount(screens.screens.game, cells[x + '-' + y]!.cellElement);
			}

			if (cellValue?.iconElement) {
				const padding = (cellSize - cellMargin * 2) * 0.1;

				setCellSizeAndPosition(
					cellValue.iconElement,
					cellSize - cellMargin * 2 - padding * 2,
					20 + padding + (boardHeight - y) * cellMargin + (boardHeight - y - 1) * cellSize,
					50 + padding + x * cellSize,
				);

				mount(screens.screens.game, cells[x + '-' + y]!.iconElement);
			}
		}
	}

	for (let i = 0; i < currentLevel[1].length; i += 1) {
		const x = i % boardWidth;
		const y = Math.floor(i / boardWidth);

		cells[x + '-' + y].neighbors = getNeighboringCells(x, y);
	}

	if (startCell) {
		cells[startCell].interact();
	}

	state.screen = 'game';
	state.level = level;
}

function createEntity(entity: Entity, cellKey: string) {
	if (entity) {
		const classObject = entities[entity[0]];
		if (classObject != null) {
			return new classObject(entity[1], cellKey);
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
	cellElement.style.width = size + 'px';
	cellElement.style.height = size + 'px';
	cellElement.style.bottom = bottom + 'px';
	cellElement.style.left = left + 'px';
}
