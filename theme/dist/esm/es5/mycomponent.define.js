
// mycomponent: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './mycomponent.core.js';
import {
  Spinner,
  StockFinder,
  StockPrice
} from './mycomponent.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, [
    Spinner,
    StockFinder,
    StockPrice
  ], opts);
}
