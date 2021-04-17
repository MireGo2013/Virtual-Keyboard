import create from "./create.js";

export default class Key {
	constructor({ small, shift, code, isFuncKey, icon }) {
		this.small = small;
		this.shift = shift;
		this.code = code;
		this.isFuncKey = isFuncKey;
		this.icon = icon;

		if (shift && shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
			this.secondSymbol = create('div', 'second_symbol', this.shift);
		} else {
			this.secondSymbol = create('div', 'second_symbol', '');
		}
		this.mainSymbol = create('div', 'main_symbol', small);

		this.wrapBtn = create('button', 'key', [this.secondSymbol, this.mainSymbol], null, ['code', this.code], ['fn', this.isFuncKey || false]);

		if (this.icon && this.icon === 'space_bar') {
			this.wrapBtn = create('button', 'key key_wide_extra', create('i', 'material-icons', this.icon), null, ['code', this.code], ['fn', this.isFuncKey || false]);
		} else if (this.icon && this.icon === 'keyboard_capslock') {
			this.wrapBtn = create('button', 'key key_wide key_activatable', create('i', 'material-icons', this.icon), null, ['code', this.code], ['fn', this.isFuncKey || false]);
		} else if (this.icon && this.icon === 'check_circle') {
			this.wrapBtn = create('button', 'key key_wide key_check', create('i', 'material-icons', this.icon), null, ['code', this.code], ['fn', this.isFuncKey || false]);
		} else if (this.icon && this.icon === 'view_quilt') {
			this.wrapBtn = create('button', 'key key_wide', create('i', 'material-icons', this.icon), null, ['code', this.code], ['fn', this.isFuncKey || false]);
		} else if (this.icon && this.icon === 'language') {
			this.wrapBtn = create('button', 'key key_wide', create('i', 'material-icons', this.icon), null, ['code', this.code], ['fn', this.isFuncKey || false]);
		} else if (this.icon && this.icon === 'keyboard_backspace') {
			this.wrapBtn = create('button', 'key key_wide', create('i', 'material-icons', this.icon), null, ['code', this.code], ['fn', this.isFuncKey || false]);
		} else if (small && small.match(/Ctrl|Alt|Tab|Back|Shift/)) {
			this.wrapBtn = create('button', 'key key_wide', this.small, null, ['code', this.code], ['fn', this.isFuncKey || false])
		}

	}
}