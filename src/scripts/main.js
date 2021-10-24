import '../style.css';
import { ScreenObserver } from "./screen";
import { CoreObserver } from "./core";
import { InputHandler } from "./inputHandler";
import Decimal from "decimal.js-light";

function main() {
    Decimal.set({ precision: 15, rounding: 4 });

    const screen = new ScreenObserver();

    const core = new CoreObserver();
    core.subscribeForStateChange(screen);

    const inputHandler = new InputHandler();
    inputHandler.subscribeForInputEvents(core);
};

main();