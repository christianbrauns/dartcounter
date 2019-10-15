import {ThemePalette} from '@angular/material';

export function typeColor(color: string): ThemePalette {
  if (color === 'primary' || color === 'accent' || color === 'warn') {
    return color as ThemePalette;
  } else {
    return undefined;
  }
}

export function reducer(accumulator: number, currentValue: number): number {
  return accumulator + currentValue;
}
