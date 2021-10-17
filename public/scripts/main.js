import { ScreenObserver } from "./screen.esm.js";
import { CoreObserver } from "./core.esm.js";
import { InputHandler } from "./inputHandler.esm.js";

function main() {
    const screen = new ScreenObserver();

    const core = new CoreObserver();
    core.subscribeForStateChange(screen);

    const inputHandler = new InputHandler();
    inputHandler.subscribeForInputEvents(core);
};

main();