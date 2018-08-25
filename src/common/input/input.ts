/**
 * The Input class handles application input. This clas may be used to check if
 * a key is currently pressed.
 *
 * One purpose of this class is to make the game logic more predictable by
 * preventing input state changes during an update. Call `processEvents` before
 * the game update to process all events added after the last call.
 *
 * Example keys are:
 *   A, B, C, ...
 *   META (Mac Command Key), SHIFT, CONTROL, ALT, ' ' (Spacebar)
 */
export class Input {
  private readonly pressedKeys: Set<string>;
  private eventBuffer: InputEvent[];

  constructor() {
    this.eventBuffer = [];
    this.pressedKeys = new Set();
    window.addEventListener('keydown', event =>
      this.onKeyEvent(new InputEvent(event.key.toUpperCase(), true))
    );
    window.addEventListener('keyup', event =>
      this.onKeyEvent(new InputEvent(event.key.toUpperCase(), false))
    );
  }

  // Processes input events. Call once before each application frame.
  public readonly processEvents = () => {
    this.eventBuffer.forEach(e => {
      this.processEvent(e);
    });
    this.eventBuffer = [];
  };

  // Takes one or more key strings and returns true if all the input keys
  // matching those key strings are pressed. E.g. `isPressed('A')` returns true
  // if the "A" key is pressed, and `isPressed('CONTROL', A')` returns true if
  // both "CONTROL" and "A" are pressed.
  public readonly isPressed = (...keys: string[]): boolean =>
    keys.every(key => this.pressedKeys.has(key));

  private readonly processEvent = (inputEvent: InputEvent) => {
    if (inputEvent.down) {
      this.pressedKeys.add(inputEvent.key);
    } else {
      this.pressedKeys.delete(inputEvent.key);
    }
  };

  private readonly onKeyEvent = (inputEvent: InputEvent) => {
    this.eventBuffer.push(inputEvent);
  };
}

class InputEvent {
  constructor(public readonly key: string, public readonly down: boolean) {
    this.key = key;
    this.down = down;
  }
}
