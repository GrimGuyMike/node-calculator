import { Subject } from "./patterns";

class InputEvent extends Subject {
    notify(input) {
        super.notify(input);
    };
};

export class InputHandler {
    inputEvent = new InputEvent();

    constructor() {
        const buttons = document.querySelectorAll('.button');

        buttons.forEach(button => {
            button.addEventListener('click', e => {
                this.inputEvent.notify({
                    role: e.target.getAttribute('data-role'),
                    value: e.target.getAttribute('data-value')
                });
            });
        });

        buttons.forEach(button => {
            button.addEventListener('keydown', e => {
                if(e.code === 'Enter') {
                    this.inputEvent.notify({
                        role: e.target.getAttribute('data-role'),
                        value: e.target.getAttribute('data-value')
                    });
                }
            });
        });
    };

    subscribe(observer) {
        this.inputEvent.subscribe(observer);
    };
};
