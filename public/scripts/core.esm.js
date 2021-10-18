import { Observer, Subject } from "./patterns.esm.js";

class StateChange extends Subject {
    notify(state) {
        super.notify(state);
    };
};

export class CoreObserver extends Observer {
    operands = {
        values: ['0', '0'],
        _current: false,

        get current() {
            return this.values[Number(this._current)];
        },

        set current(val) {
            this.values[Number(this._current)] = val;
        },

        toggle() {
            this._current = !this._current;
        },

        reset() {
            this.values = ['0', '0'];
            this._current = false;
        }
    };
    result = undefined;

    newScreenStateChange = new StateChange();

    subscribeForStateChange(screenObserver) {
        this.newScreenStateChange.subscribe(screenObserver);
    };

    update(input) {
        switch(input.role) {
            case 'char': {
                this.appendChar(input.value);
                break;
            };

            default: {
                try {
                    this[input.role]();
                } catch(err) {
                    console.warn(`role: ${input.role} --> ${err.message}`); // ONLY FOR DEVELOPMENT
                }
            }
        }
    };

    appendChar(char) {
        if(this.operands.current === '0') {
            if(char === '.') {
                this.operands.current += char;
            } else {
                this.operands.current = char;
            }
        } else {
            if(!(char === '.' && this.operands.current.includes(char))) {
                this.operands.current += char;
            }
        }

        this.newScreenStateChange.notify({ entry: this.operands.current });
    };

    clear() {
        this.operands.reset();
        this.result = undefined;

        this.newScreenStateChange.notify({
            history: '',
            entry: this.operands.current
        });
    };

    clearEntry() {
        this.operands.current = '0';

        this.newScreenStateChange.notify({
            entry: this.operands.current
        });
    };

    erase() {
        if(this.operands.current.length === 1) {
            this.operands.current = '0';
        } else {
            this.operands.current = this.operands.current.substring(0, this.operands.current.length - 1);
        }

        this.newScreenStateChange.notify({
            entry: this.operands.current
        });
    };
};