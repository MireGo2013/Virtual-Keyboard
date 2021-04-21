import { get } from './utils/storage.js';
import Keyboard from './utils/Keyboard.js';
import create from './utils/create.js';


const rowsOrderBtn = [
	['Escape', 'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
	['Tab', "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", 'Delete'],
	["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash", "Enter"],
	['ShiftLeft', "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", 'Disabled', 'ArrowUp', 'Disabled'],
	['ControlLeft', 'MetaLeft', 'AltLeft', "Space", 'Onlyclik', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
];

const lang = get('keyboardLeng', '"en"')

const main = create('main', '', create('h1', 'title', 'Task Virtual Keyboard'))

const keyboard = new Keyboard(rowsOrderBtn)
keyboard.init(lang)
keyboard.generateLayout()
main.appendChild(keyboard.output)
main.appendChild(keyboard.container)
document.body.prepend(main)

