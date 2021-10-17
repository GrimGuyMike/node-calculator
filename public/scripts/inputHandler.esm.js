import { Subject } from "./patterns.esm.js";

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

    subscribeForEvents(observer) {
        this.newInputEvent.subscribe(observer);
    };
};

export class InputEvent extends Subject {
    notify(input) {
        super.notify(input);
    };
};