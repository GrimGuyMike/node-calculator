import { Observer, Subject } from "./patterns.esm.js";

class StateChange extends Subject {
    notify(state) {
        super.notify(state);
    };
};

export class CoreObserver extends Observer {
    state = {
        total: null,
        next: null,
        operator: null,

        reset() {
            this.total = null;
            this.next = null;
            this.operator = null;
        }
    };

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

            case 'invert':
            case 'clear':
            case 'clearEntry':
            case 'erase': {
                this[input.role]();
                break;
            };

            case 'reciprocal':
            case 'square':
            case 'squareRoot': {
                if(this.state.total) {
                    this.state.next = this.state.total;
                    this.state.total = null;
                }

                if(this.state.next) this[input.role]();
                break;
            };

            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide': {
                this.operation(input);
                break;
            };

            default: {
                throw new Error('Unknown input \"' + input.role + '\"');
            };
        }
    };

    appendChar(char) {
        if(this.state.total && !this.state.operator) this.clear();

        if(!this.state.next) {
            switch(char) {
                case '.': {
                    this.state.next = '0' + char;
                    break;
                };

                case '0': break;
                
                default: this.state.next = char;
            }
        } else {
            switch(char) {
                case '.': {
                    if(this.state.next.includes(char)) break;
                    this.state.next += char;
                    break;
                };

                case '0': {
                    if(this.state.next === char) break;
                    this.state.next += char;
                    break;
                };

                default: this.state.next += char;
            }
        }

        this.newScreenStateChange.notify({ entry: this.state.next ?? '0' });
    };

    clear() {
        this.state.reset();

        this.newScreenStateChange.notify({
            history: '',
            entry: '0'
        });
    };

    clearEntry() {
        if(this.state.total && !this.state.next) this.clear();

        this.state.next = null;

        this.newScreenStateChange.notify({
            entry: '0'
        });
    };

    erase() {
        const isDecimal = this.state.next.includes('.');
        const absIsSingleDigit = Math.abs(+this.state.next) < 10;
        const [intPart, decPart] = this.state.next.split('.');
        const intPartIsSingleDigit = Math.abs(+intPart) < 10;

        if((!isDecimal && absIsSingleDigit) || (isDecimal && intPartIsSingleDigit && !decPart)) {
            this.state.next = null;
        } else {
            this.state.next = this.state.next.substring(0, this.state.next.length - 1);
        }

        this.newScreenStateChange.notify({
            entry: this.state.next ?? '0'
        });
    };

    invert() {
        if(this.state.next) {
            this.state.next = String(-this.state.next);

            this.newScreenStateChange.notify({ entry: this.state.next });
        }
    };

    reciprocal() {
        const num = new Decimal(this.state.next);
        this.state.next = null;
        this.state.total = num.toPower(-1).val();

        this.newScreenStateChange.notify({
            history: '1/' + num.val() + '=',
            entry: this.state.total
        });
    };

    square() {
        const num = new Decimal(this.state.next);
        this.state.next = null;
        this.state.total = num.toPower(2).val();

        this.newScreenStateChange.notify({
            history: num.val() + '^2=',
            entry: this.state.total
        });
    };

    squareRoot() {
        const num = new Decimal(this.state.next);
        this.state.next = null;
        this.state.total = num.squareRoot().val();

        this.newScreenStateChange.notify({
            history: 'sqrt(' + num.val() + ')=',
            entry: this.state.total
        });
    };

    operation(input) {
        if(this.state.total) {
            if(this.state.operator) {                
                const prevTotal = new Decimal(this.state.total);
                
                switch(this.state.operator.role) {
                    case 'add': {
                        this.state.total = prevTotal.plus(this.state.next).val();
                        break;
                    };
                    case 'subtract': {
                        this.state.total = prevTotal.minus(this.state.next).val();
                        break;
                    };
                    case 'multiply': {
                        this.state.total = prevTotal.times(this.state.next).val();
                        break;
                    };
                    case 'divide': this.state.total = prevTotal.dividedBy(this.state.next).val();
                }
            }
        } else {
            this.state.total = this.state.next;
        }
        this.state.operator = input;
        this.state.next = null;

        this.newScreenStateChange.notify({
            history: this.state.total + this.state.operator.value,
            entry: this.state.next ?? '0'
        });
    };
};