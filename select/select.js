const getTemplate = ({placeholder, data = [], selectedId}) => {
	let text = placeholder ?? "Default placeholder";

	let items = data.map(({id, value}) => {
		let activeClass = "";

		if (id === selectedId) {
			activeClass = "selected"
			text = value;
		}

		return (
			`<li class="select__item ${activeClass}" data-type="item" data-value=${id}>${value}</li>`
		)
	});
	items = items.join("");

	return `
		<div class="select__backdrop" data-type="backdrop"></div>
		<div class="select__input" data-type="input">
			<span data-type="value">${text}</span>
			<i class="fas fa-chevron-down" data-type="arrow"></i>
		</div>
		<div class="select__dropdown">
			<ul class="select__list">
				${items}
			</ul>
		</div>
	`;
}

export class Select {
	constructor(selector, options) {
		this.$el = document.querySelector(selector);
		this.options = options;
		this.selectedId = options.selectedId;

		this.#render();
		this.#setup();
	}

	#render() {
		const { data, placeholder } = this.options;

		this.$el.classList.add("select");
		this.$el.innerHTML = getTemplate({placeholder, data, selectedId: this.selectedId});
	}

	#setup() {
		this.clickHandler = this.clickHandler.bind(this);
		this.$arrow = this.$el.querySelector('[data-type="arrow"]');
		this.$value = this.$el.querySelector('[data-type="value"]');

		this.$el.addEventListener("click", this.clickHandler);
	}

	clickHandler(evt) {
		const { type } = evt.target.dataset;

		switch (type) {
			case "input":
				this.toggle();
				break;
			case "item":
				this.select(evt.target.dataset.value);
				break;
			case "backdrop":
				this.close();

		}
	}

	get isOpen() {
		return this.$el.classList.contains("open");
	}

	get current() {
		return this.options.data.find(item => item.id === this.selectedId);
	}

	select(id) {
		this.selectedId = +id;
		this.$value.textContent = this.current.value;

		this.$el.querySelectorAll(`[data-type="item"]`).forEach(el => {
			el.classList.remove("selected");
		})
		this.$el.querySelector(`[data-value="${this.selectedId}"]`).classList.add("selected");

		this.options.onSelect && this.options.onSelect(this.current);

		this.close();
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.$el.classList.add("open");
		this.$arrow.classList.remove("fa-chevron-down");
		this.$arrow.classList.add("fa-chevron-up");
	}

	close() {
		this.$el.classList.remove("open");
		this.$arrow.classList.add("fa-chevron-down");
		this.$arrow.classList.remove("fa-chevron-up");
	}

	destroy() {
		this.$el.removeEventListener("click", this.clickHandler);
		this.$el.innerHTML = "";
	}
}