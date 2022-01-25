import '../style.css';
import { ScreenObserver } from "./screen";
import { CoreObserver } from "./core";
import { InputHandler } from "./inputHandler";
import Decimal from "decimal.js-light";

(function() {
    Decimal.set({ precision: 15, rounding: 4 });

    const screen = new ScreenObserver(),
          core = new CoreObserver(),
          inputHandler = new InputHandler();

    core.subscribe(screen);
    inputHandler.subscribe(core);
})();
