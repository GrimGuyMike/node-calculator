import { Observer, Subject } from "./patterns.esm.js";

class StateChange extends Subject {
    notify(state) {
        super.notify(state);
    };
};

export class CoreObserver extends Observer {
    operand1 = undefined;
    operand2 = undefined;
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

            case 'clear': {
                this.clear();
                break;
            }
        }
    };

    appendChar(char) {
        if(!this.operand1) {
            this.operand1 = char
        } else {
            this.operand1 += char;
        }

        this.newScreenStateChange.notify({ entry: this.operand1 });
    };

    clear() {
        this.operand1 = undefined;
        this.operand2 = undefined;
        this.result = undefined;

        this.newScreenStateChange.notify({
            history: '',
            entry: '0'
        });
    };
};