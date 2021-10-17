import { ScreenObserver, ScreenStateChange } from "./screen.esm.js";

function main() {
    const screen = new ScreenObserver();

    let newState = new ScreenStateChange();
    newState.subscribe(screen);
    newState.notify({
        history: 'hello',
        entry: 'world'
    });
};

main();