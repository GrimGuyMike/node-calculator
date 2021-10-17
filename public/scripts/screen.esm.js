import { Observer, Subject } from "./patterns.esm.js";

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

export class ScreenStateChange extends Subject {
    notify(state) {
        super.notify(state);
    };
};