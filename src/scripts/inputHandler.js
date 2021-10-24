import { Subject } from "./patterns";

class InputEvent extends Subject {
    notify(input) {
        super.notify(input);
    };
};

export class InputHandler {
    newInputEvent = new InputEvent();

    constructor() {
        const buttons = document.querySelectorAll('.button');

        buttons.forEach(button => {
            button.addEventListener('click', e => {
                this.newInputEvent.notify({
                    role: e.target.getAttribute('data-role'),
                    value: e.target.getAttribute('data-value')
                });
            });
        });

        buttons.forEach(button => {
            button.addEventListener('keydown', e => {
                if(e.code === 'Enter') {
                    this.newInputEvent.notify({
                        role: e.target.getAttribute('data-role'),
                        value: e.target.getAttribute('data-value')
                    });
                }
            });
        });
    };

    subscribeForInputEvents(observer) {
        this.newInputEvent.subscribe(observer);
    };
};