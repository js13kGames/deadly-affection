// TODO: Replace with redom library

export function el(tagAndClasses: string, content: null | string | HTMLElement | HTMLElement[] = null) {
	const parts = tagAndClasses.split('.');
	const tag = parts.shift();

	const element = document.createElement(tag!);

	parts.forEach((part) => {
		element.classList.add(part);
	});

	if (typeof content === 'string') {
		element.textContent = content;
	} else if (Array.isArray(content)) {
		content.forEach((item) => mount(element, item));
	} else if (content != null) {
		mount(element, content);
	}

	return element;
}

export function mount(container: HTMLElement, element: HTMLElement) {
	container.insertAdjacentElement('beforeend', element);
}
