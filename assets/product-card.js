if (!customElements.get('product-card')) {
	class ProductCard extends HTMLElement {
		constructor() {
			super()
			window.initLazyScript(this, this.init.bind(this))
		}

		init() {
		}

		/**
		 * Handles 'change' events in the product card swatches.
		 * @param {object} evt - Event object.
		 */
		handleSwatchChange(evt) {
		}
	}

	customElements.define('product-card', ProductCard)
}
