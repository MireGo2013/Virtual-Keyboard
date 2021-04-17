import create from './create.js';
import languageAll from '../layouts/language.js';
import Key from './Keys.js';
import * as storage from './storage.js';

const main = create('main', '', create('h1', 'title', 'Task Virtual Keyboard'))

export default class Keyboard {
	constructor(rowsOrderBtn) {
		this.rowsOrderBtn = rowsOrderBtn;
		this.keysPressed = {};
		this.isCaps = false;
		this.isAltlKey = false;
	}

	init(langCode) {
		this.keyBase = languageAll[langCode];
		this.output = create('textarea', '', null, main,
			['name', 'onput'],
			['id', 'area'],
			['cols', '30'],
			['rows', '10'],
			['placeholder', 'Click me and start type some text...\nCtrl+Alt - switch lenguage']);
		this.container = create('section', 'keyboard_wrapper', null, main, ['language', langCode]);
		return this;
	}

	generateLayout() {
		this.keyButtons = [];
		this.rowsOrderBtn.forEach((row, i) => {
			const rowElem = create('div', 'keyboard_order_keys', null, this.container, ['rows', i + 1]);
			row.forEach((code) => {
				const keyObj = this.keyBase.find((key) => key.code === code);
				if (keyObj) {
					const keyButton = new Key(keyObj);
					this.keyButtons.push(keyButton);
					rowElem.appendChild(keyButton.wrapBtn)
				}
			})
		})

		document.addEventListener('keydown', this.handleEvent)
		document.addEventListener('keyup', this.handleEvent)
		this.container.addEventListener('mousedown', this.mouseEventHandler)
		this.container.addEventListener('mouseup', this.mouseEventHandler)
		this.container.addEventListener('mouseout', this.mouseEventHandler)
		this.output.addEventListener('click', this.startType)

	}

	startType = (e) => {
		if (this.output) {
			this.container.classList.add('active')
		}
	}

	mouseEventHandler = (e) => {
		e.stopPropagation();
		const keyBtn = e.target.closest('.key');
		if (!keyBtn) return
		const { dataset: { code } } = keyBtn;
		this.handleEvent({ code, type: e.type });
	}

	handleEvent = (e) => {
		if (e.stopPropagation) e.stopPropagation();
		const { code, type } = e;
		const keyObj = this.keyButtons.find((key) => key.code === code)
		if (!keyObj) return;
		this.output.focus();
		if (type.match(/keydown|mousedown|click/)) {
			if (type.match(/keydown/)) e.preventDefault();
			this.container.classList.add('active');
			if (code.match(/ShiftLeft/)) this.isShiftKey = true;
			if (this.isShiftKey) this.toggleUppeCase(true)
			keyObj.wrapBtn.classList.add('active');
			keyObj.wrapBtn.classList.add('key_activatable_active');
			if (code.match(/Caps/) && !this.isCaps) {
				this.isCaps = true;
				this.toggleUppeCase(true);
			} else if (code.match(/Caps/) && this.isCaps) {
				this.isCaps = false;
				this.toggleUppeCase(false);
				keyObj.wrapBtn.classList.remove('key_activatable_active');
			}
			//Switch lenguage
			if (code.match(/Control/)) this.isCtrlKey = true;
			if (code.match(/AltLeft/)) this.isAltlKey = true;
			if (code.match(/Control/) && this.isAltlKey) this.toggleLanguage();
			if (code.match(/AltLeft/) && this.isCtrlKey) this.toggleLanguage();
			if (code.match(/Onlyclik/)) this.toggleLanguage();
			//toPrint
			if (!this.isCaps) {
				this.printToText(keyObj, this.isShiftKey ? keyObj.shift : keyObj.small)
			} else if (this.isCaps) {
				if (this.isShiftKey) {
					this.printToText(keyObj, keyObj.secondSymbol.innerHTML ? keyObj.shift : keyObj.small);
				} else {
					this.printToText(keyObj, !keyObj.secondSymbol.innerHTML ? keyObj.shift : keyObj.small);
				}
			}
			//closing keyboard 
			if (code.match(/Escape/)) {
				this.container.classList.remove('active')
				this.output.blur();
			}
		} else if (type.match(/keyup|mouseup|mouseout/)) {
			keyObj.wrapBtn.classList.remove('active');
			if (code.match(/AltLeft/)) {
				this.isAltlKey = false
			};
			if (code.match(/Control/)) {
				this.isCtrlKey = false
			};
			if (code.match(/ShiftLeft/)) {
				this.toggleUppeCase(false);
				this.isShiftKey = false;
			}
		}

	}

	toggleLanguage() {
		const languages = Object.keys(languageAll);
		let langIndx = languages.indexOf(this.container.dataset.language);
		this.keyBase = langIndx + 1 < languages.length ? languageAll[languages[langIndx += 1]] : languageAll[languages[langIndx -= 1]];
		this.container.dataset.language = languages[langIndx];
		storage.set('keyboardLeng', languages[langIndx])
		this.keyButtons.forEach((button) => {
			const keyObj = this.keyBase.find((key) => key.code === button.code);
			if (!keyObj) return;
			button.shift = keyObj.shift;
			button.small = keyObj.small;
			if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
				button.secondSymbol.innerHTML = keyObj.shift;
			} else {
				button.secondSymbol.innerHTML = '';
			}
			button.mainSymbol.innerHTML = keyObj.small;
		})
		if (this.isCaps) {
			this.toggleUppeCase(true)
		}
	}

	toggleUppeCase(isTrue) {
		if (isTrue) {
			this.keyButtons.forEach((button) => {
				if (button.secondSymbol) {
					if (this.isShiftKey && button.secondSymbol.innerHTML) {
						button.secondSymbol.classList.add('activeSymbol');
						button.mainSymbol.classList.add('inactiveSymbol');
					}
				}
				if (!button.isFuncKey && this.isCaps && !this.isShiftKey && !button.secondSymbol.innerHTML) {
					button.mainSymbol.innerHTML = button.shift;
				} else if (!button.isFuncKey && this.isCaps && this.isShiftKey) {
					button.mainSymbol.innerHTML = button.small;
				} else if (!button.isFuncKey && !button.secondSymbol.innerHTML) {
					button.mainSymbol.innerHTML = button.shift;
				}
			});
		} else {
			this.keyButtons.forEach((button) => {
				if (button.secondSymbol.innerHTML && !button.isFuncKey) {
					button.secondSymbol.classList.remove('activeSymbol');
					button.mainSymbol.classList.remove('inactiveSymbol');
					if (!this.isCaps) {
						button.mainSymbol.innerHTML = button.small;
					} else if (!this.isCaps) {
						button.mainSymbol.innerHTML = button.shift;
					}
				} else if (!button.isFuncKey) {
					if (this.isCaps) {
						button.mainSymbol.innerHTML = button.shift;
					} else {
						button.mainSymbol.innerHTML = button.small;
					}
				}
			});
		}
	}

	printToText(keyObj, symbol) {
		let cursorPos = this.output.selectionStart;
		const leftPos = this.output.value.slice(0, cursorPos);
		const rightPos = this.output.value.slice(cursorPos);
		const funcBtnHandler = {
			Tab: () => {
				this.output.value = `${leftPos}\t${rightPos}`;
				cursorPos += 1;
			},
			ArrowLeft: () => {
				cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
			},
			ArrowRight: () => {
				cursorPos += 1;
			},
			ArrowUp: () => {
				const posFromLeft = this.output.value.slice(0, cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
				cursorPos -= posFromLeft[0].length;
			},
			ArrowDown: () => {
				const posFromLeft = this.output.value.slice(cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
				cursorPos += posFromLeft[0].length;
			},
			Enter: () => {
				this.output.value = `${leftPos}\n${rightPos}`;
				cursorPos += 1;
			},
			Backspace: () => {
				this.output.value = `${leftPos.slice(0, -1)}${rightPos}`;
				cursorPos -= 1;
			},
			Delete: () => {
				this.output.value = `${leftPos}${rightPos.slice(1)}`;
			},
			Space: () => {
				this.output.value = `${leftPos} ${rightPos}`;
				cursorPos += 1;
			}
		}
		if (funcBtnHandler[keyObj.code]) funcBtnHandler[keyObj.code]();
		else if (!keyObj.isFuncKey) {
			cursorPos += 1;
			this.output.value = `${leftPos}${symbol || ''}${rightPos}`;
		}
		this.output.setSelectionRange(cursorPos, cursorPos);
	}
}

