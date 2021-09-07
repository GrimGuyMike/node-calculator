function main() {

    // Objects setup

    const screen = function(){

        let history = document.querySelector('.screen > .history');
        let current = document.querySelector('.screen > .current');

        return {

            doReset: false,

            clear(){
                current.innerText = 0;
                history.innerText = '';
            },

            clearEntry(){
                current.innerText = 0;
            },

            appendNumber(val){

                if(this.doReset){
                    this.clear();
                    this.doReset = false;
                }

                let entry = this.getEntry();

                switch(val){

                    case '.': {
                        if(entry.includes(val)){
                            return;
                        } else {
                            break;
                        }
                    };

                    case '0': {
                        if(entry.startsWith(val) && !entry.includes('.')) return;
                    };

                    default: {
                        if(entry.startsWith('0') && !entry.includes('.')){
                            entry = entry.substring(0, entry.length - 1);
                        }
                    };

                }

                entry = entry + val;
                current.innerText = entry;

            },

            toggleSign(){

                let entry = this.getEntry();

                if(entry.startsWith('0') && !entry.includes('.')){
                    return;
                }
                
                if(entry.startsWith('-')){
                    entry = entry.substring(1, entry.length);
                } else {
                    entry = '-' + entry;
                }

                this.clearEntry();
                this.appendNumber(entry);

            },

            erase(){

                let entry = this.getEntry();

                if(entry.length == 1){
                    entry = 0;
                } else {
                    entry = entry.substring(0, entry.length - 1);
                }

                this.clearEntry();
                this.appendNumber(entry);

            },

            writeToHistory(val){
                history.innerText = val;
            },

            getEntry(){
                return current.innerText;
            },

            getHistory(){
                return history.innerText;
            }

        }

    }();

    const calculator = {

        opd1: undefined,
        opd2: undefined,
        op: undefined,

        operation(op){

            if(screen.doReset){
                screen.doReset = false;
            }

            let primOps = ['+', '-', '*', '/'];
            let specOps = ['%', 'rec', 'sqr', 'sqrt']; // percentage, reciprocal, square, square root
            
            if(primOps.includes(op)){

                if(this.opd1 != undefined){

                    this.opd2 = Number(screen.getEntry());
                    let result = eval(this.opd1 + this.op + this.opd2);
                    this.opd1 = result;
                    this.op = op;
                    screen.writeToHistory(this.opd1 + this.op);
                    this.opd2 = undefined;

                } else {

                    this.opd1 = Number(screen.getEntry());
                    this.op = op;
                    screen.writeToHistory(this.opd1 + this.op);

                }

                screen.clearEntry();
                return;

            }

            if(specOps.includes(op)){

                let entry = Number(screen.getEntry());

                switch(op){

                    case '%': {

                        if(this.op == '/'){

                            let expression = this.opd1 + this.op + entry;
                            let result = eval(expression) * 100;
                            this.clear();
                            screen.clear();
                            screen.writeToHistory(expression + '=(%)');
                            screen.appendNumber(result);
                            screen.doReset = true;

                        } else {

                            entry /= 100;
                            screen.clearEntry();
                            screen.appendNumber(entry);
                            
                        }

                        break;

                    };

                    case 'rec': {

                        screen.clear();
                        screen.writeToHistory('1/' + entry + '=');
                        entry **= -1;
                        screen.appendNumber(entry);
                        screen.doReset = true;

                        break;

                    };

                    case 'sqr': {

                        screen.clear();
                        screen.writeToHistory('sqr(' + entry + ')=');
                        entry **= 2;
                        screen.appendNumber(entry);
                        screen.doReset = true;

                        break;

                    };

                    case 'sqrt': {

                        screen.clear();
                        screen.writeToHistory('sqrt(' + entry + ')=');
                        entry **= .5;
                        screen.appendNumber(entry);
                        screen.doReset = true;

                    };

                }

            }

        },

        compute(){
            
            let expression = screen.getHistory() + screen.getEntry();
            let result = eval(expression);
            calculator.clear();
            screen.clear();
            screen.writeToHistory(expression + '=');
            screen.appendNumber(result);

            screen.doReset = true;

        },

        clear(){

            this.opd1 = undefined;
            this.opd2 = undefined;
            this.op = undefined;

        }

    };

    // Number keys

    for(let i=0; i<10; i++){
        document.querySelector(`.button._${i}`).addEventListener('click', function(){
            screen.appendNumber(this.innerText);
        });
    }

    // Point key

    document.querySelector('.button.point').addEventListener('click', function(){
        screen.appendNumber(this.innerText);
    });

    // C, CE, Erase

    document.querySelector('.button.clear').addEventListener('click', () => {
        calculator.clear();
        screen.clear();
    });

    document.querySelector('.button.clear-entry').addEventListener('click', () => {
        screen.clearEntry();
    });

    document.querySelector('.button.erase').addEventListener('click', () => {
        screen.erase();
    });

    // Primitive operators

    document.querySelectorAll('.button.primOp').forEach(opBtn => {
        opBtn.addEventListener('click', function(){
            calculator.operation(this.innerText);
        });
    });

    // Special operators

    document.querySelector('.button.percentage').addEventListener('click', () => {
        calculator.operation('%');
    });

    document.querySelector('.button.reciprocal').addEventListener('click', () => {
        calculator.operation('rec');
    });

    document.querySelector('.button.sqr').addEventListener('click', () => {
        calculator.operation('sqr');
    });

    document.querySelector('.button.sqrt').addEventListener('click', () => {
        calculator.operation('sqrt');
    });

    // Sign toggle key

    document.querySelector('.button.sign').addEventListener('click', () =>  {
        screen.toggleSign();
    });

    // Equals key

    document.querySelector('.button.equals').addEventListener('click', () => {
        calculator.compute();
    });
    
}

main();