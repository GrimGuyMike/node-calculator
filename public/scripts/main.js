import { ScreenObserver } from "./screen.esm.js";

function main() {
    const screen = new ScreenObserver();

    screen.update({
        history: 'hello',
        entry: 'world'
    });
}

main();