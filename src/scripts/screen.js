import { Observer } from "./patterns";

export class ScreenObserver extends Observer {
    _entry = document.querySelector('.screen > .current');
    _history = document.querySelector('.screen > .history');

    set entry(val) {
        this._entry.innerText = val;
    };

    set history(val) {
        this._history.innerText = val;
    };

    update(state) {
        for(let prop in state) {
            this[prop] = state[prop];
        }
    };
};