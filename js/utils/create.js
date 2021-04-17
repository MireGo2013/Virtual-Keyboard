export default function createElem(el, clsName, children, parent, ...attr) {
	let element = null;
	try {
		element = document.createElement(el)
	} catch (error) {
		throw new Error('Error create function element');
	}

	if (clsName) {
		element.classList.add(...clsName.split(' '));
	}

	if (children && Array.isArray(children)) {
		children.forEach((child) => child && element.appendChild(child));
	} else if (children && typeof children === 'object') {
		element.appendChild(children);
	} else if (children && typeof children === 'string') {
		element.innerHTML = children;
	}

	if (parent) {
		parent.appendChild(element);
	}

	if (attr.length) {
		attr.forEach(([nameAttr, valueAttr]) => {
			if (valueAttr === '') {
				element.setAttribute(nameAttr, '');
			}
			if (nameAttr.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
				element.setAttribute(nameAttr, valueAttr);
			} else {
				element.dataset[nameAttr] = valueAttr;
			}
		});
	}
	return element;
}