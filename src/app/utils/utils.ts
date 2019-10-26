import { ThemePalette } from '@angular/material';

import { PlayerGameData } from '../game/game.component';

export function typeColor(color: string): ThemePalette {
  if (color === 'primary' || color === 'accent' || color === 'warn') {
    return color as ThemePalette;
  } else {
    return undefined;
  }
}

export function reducer(accumulator: number, currentValue: number | string): number {
  if (typeof currentValue === 'string') {
    if (String(currentValue).charAt(0) === 'T') {
      return Number(currentValue.substr(1)) * 3 + accumulator;
    } else {
      return Number(currentValue.substr(1)) * 2 + accumulator;
    }
  }

  return accumulator + Number(currentValue);
}

export function getPlayerCount(player: PlayerGameData): number {
  return Number(player.throws.reduce(reducer, 0));
}
