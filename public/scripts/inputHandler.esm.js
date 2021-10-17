import { Subject } from "./patterns.esm.js";

class InputEvent extends Subject {
    notify(input) {
        super.notify(input);
    };
};

export class InputHandler {
    newInputEvent = new InputEvent();

    constructor() {
        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', e => {
                this.newInputEvent.notify({
                    role: e.target.getAttribute('data-role'),
                    value: e.target.getAttribute('data-value')
                });
            });
        });
    };

    subscribeForInputEvents(observer) {
        this.newInputEvent.subscribe(observer);
    };
};