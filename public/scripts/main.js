import { InputHandler } from "./inputHandler.esm.js";
import { ScreenObserver, ScreenStateChange } from "./screen.esm.js";

function main() {
    const screen = new ScreenObserver();

    let newState = new ScreenStateChange();
    newState.subscribe(screen);
    newState.notify({
        history: 'hello',
        entry: 'world'
    });

    const inputHandler = new InputHandler();
    inputHandler.subscribeForEvents({
        update: input => console.log(input)
    });
};

main();