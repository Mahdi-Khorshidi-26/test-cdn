/*! Built with http://stenciljs.com */
import { h } from '../mycomponent.core.js';

import { a as AV_API_KEY } from './chunk-5b2ea69d.js';

class StockFinder {
    constructor() {
        this.searchResults = [];
        this.loading = false;
    }
    onFindStocks(event) {
        event.preventDefault();
        this.loading = true;
        const stockName = this.stockNameInput.value;
        fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
            .then(res => res.json())
            .then(parsedRes => {
            this.searchResults = parsedRes['bestMatches'].map(match => {
                return { name: match['2. name'], symbol: match['1. symbol'] };
            });
            console.log(this.searchResults);
            this.loading = false;
        })
            .catch(err => {
            console.log(err);
            this.loading = false;
        });
    }
    onSelectSymbol(symbol) {
        this.ucSymbolSelected.emit(symbol);
    }
    render() {
        let content = (h("ul", null, this.searchResults.map(result => (h("li", { onClick: this.onSelectSymbol.bind(this, result.symbol) },
            h("strong", null, result.symbol),
            " - ",
            result.name)))));
        if (this.loading) {
            content = h("uc-spinner", null);
        }
        return [
            h("form", { onSubmit: this.onFindStocks.bind(this) },
                h("input", { id: "stock-symbol", ref: el => (this.stockNameInput = el) }),
                h("button", { type: "submit" }, "Find!")),
            content
        ];
    }
    static get is() { return "uc-stock-finder"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "loading": {
            "state": true
        },
        "searchResults": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "ucSymbolSelected",
            "method": "ucSymbolSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".sc-uc-stock-finder-h{font-family:sans-serif;border:2px solid var(--color-primary,#000);margin:2rem;padding:1rem;display:block;width:20rem;max-width:100%}form.sc-uc-stock-finder   input.sc-uc-stock-finder{font:inherit;color:var(--color-primary,#000);padding:.1rem .25rem;display:block;margin-bottom:.5rem}form.sc-uc-stock-finder   button.sc-uc-stock-finder:focus, form.sc-uc-stock-finder   input.sc-uc-stock-finder:focus{outline:none}form.sc-uc-stock-finder   button.sc-uc-stock-finder{font:inherit;padding:.25rem .5rem;border:1px solid var(--color-primary,#000);background:var(--color-primary,#000);color:var(--color-primary-inverse,#fff);cursor:pointer}form.sc-uc-stock-finder   button.sc-uc-stock-finder:active, form.sc-uc-stock-finder   button.sc-uc-stock-finder:hover{background:var(--color-primary-highlight,grey);border-color:var(--color-primary-highlight,grey)}form.sc-uc-stock-finder   button.sc-uc-stock-finder:disabled{background:#ccc;border-color:#ccc;color:#fff;cursor:not-allowed}ul.sc-uc-stock-finder{margin:0;padding:0;list-style:none}li.sc-uc-stock-finder{margin:.25rem 0;padding:.25rem;border:1px solid #ccc;cursor:pointer}li.sc-uc-stock-finder:active, li.sc-uc-stock-finder:hover{background:var(--color-primary,#000);color:var(--color-primary-inverse,#fff)}"; }
}

export { StockFinder as UcStockFinder };
