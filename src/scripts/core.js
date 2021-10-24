import { Observer, Subject } from "./patterns";
import Decimal from "decimal.js-light";

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
        try {
            switch(input.role) {
                case 'char': {
                    this.appendChar(input.value);
                    break;
                };
    
                case 'invert':
                case 'clear':
                case 'clearEntry':
                case 'erase':
                case 'execute': {
                    this[input.role]();
                    break;
                };
    
                case 'reciprocal':
                case 'square':
                case 'squareRoot': {
                    this.unary(input);
                    break;
                };
    
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide': {
                    this.binary(input);
                    break;
                };
    
                case 'percent': {
                    this.percent();
                    break;
                };
    
                default: {
                    console.warn('Unknown input \"' + input.role + '\"');
                };
            }
        } catch(err) {
            if(err instanceof Error && /DecimalError/.test(err.message)) {
                let entry = err.message.split(' ');
                entry.shift();
                entry = entry.join(' ');

                this.newScreenStateChange.notify({
                    history: 'Error',
                    entry
                });
            }
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
        if(this.state.total && !this.state.operator) this.clear();

        this.state.next = null;

        this.newScreenStateChange.notify({
            entry: '0'
        });
    };

    erase() {
        if(this.state.total && !this.state.operator) this.clear();

        if(this.state.next) {
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
        }
    };

    invert() {
        if(this.state.next) {
            this.state.next = String(-this.state.next);

            this.newScreenStateChange.notify({ entry: this.state.next });
        }
    };

    unary(input) {
        if(this.state.total) {
            this.state.next = this.state.total;
            this.state.total = null;
        }

        if(!this.state.next) this.state.next = '0';

        const num = new Decimal(this.state.next);
        this.state.next = null;

        var history;
        switch(input.role) {
            case 'reciprocal': {
                this.state.total = num.toPower(-1).val();
                history = '1/' + num.val() + '=';
                break;
            };
            case 'square': {
                this.state.total = num.toPower(2).val();
                history = num.val() + '^2=';
                break;
            };
            case 'squareRoot': {
                this.state.total = num.squareRoot().val();
                history = 'sqrt(' + num.val() + ')=';
            };
        }

        this.newScreenStateChange.notify({
            history,
            entry: this.state.total
        });
    };

    compute() {
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

        return prevTotal.val();
    };

    binary(input) {
        if(this.state.total) {
            if(this.state.operator && this.state.next) {
                this.compute();
            }
        } else {
            if(!this.state.next) this.state.next = '0';
            this.state.total = this.state.next;
        }
        this.state.operator = input;
        this.state.next = null;

        this.newScreenStateChange.notify({
            history: this.state.total + this.state.operator.value,
            entry: this.state.next ?? '0'
        });
    };

    execute() {
        if(this.state.total) {
            if(!this.state.next) this.state.next = '0';

            const prevTotal = this.compute();
    
            this.newScreenStateChange.notify({
                history: prevTotal + this.state.operator.value + this.state.next + '=',
                entry: this.state.total
            });
            this.state.operator = null;
            this.state.next = null;
        }
    };

    percent() {
        if(this.state.next) {
            if(this.state.operator?.role === 'divide') {
                if(this.state.total.includes('-') || this.state.next.includes('-')) return;

                const prevTotal = new Decimal(this.state.total);
                this.state.total = prevTotal.dividedBy(this.state.next).times('100').val();
                this.newScreenStateChange.notify({
                    history: prevTotal.val() + '/' + this.state.next + '=',
                    entry: this.state.total + '%'
                });
                this.state.operator = null;
                this.state.next = null;
                return;
            }
            
            if(this.state.next.includes('-')) return;
            this.state.next = (new Decimal(this.state.next)).dividedBy('100').val();
            this.newScreenStateChange.notify({ entry: this.state.next });
        }
    };
};