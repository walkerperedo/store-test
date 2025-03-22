function initLazyScript(element, callback, threshold = 500) {
	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (typeof callback === 'function') {
							callback()
							observer.unobserve(entry.target)
						}
					}
				})
			},
			{ rootMargin: `0px 0px ${threshold}px 0px` }
		)

		io.observe(element)
	} else {
		callback()
	}
}

/**
 * Initialises lazy load images.
 */
function initLazyImages() {
	if ('loading' in HTMLImageElement.prototype === false && 'IntersectionObserver' in window) {
		// If native lazyload not supported but IntersectionObserver supported (Safari).
		const io = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target
						setImageSources(img)
						observer.unobserve(img)
					}
				})
			},
			{ rootMargin: '0px 0px 500px 0px' }
		)

		document.querySelectorAll('[loading="lazy"]').forEach((img) => {
			io.observe(img)
		})
	} else {
		// If native lazy load supported or IntersectionObserver not supported (legacy browsers).
		document.querySelectorAll('[loading="lazy"]').forEach((img) => {
			setImageSources(img)
		})
	}
}

function setImageSources(img) {
	const setImageAttr = (el) => {
		if (el.dataset.src && !el.src) {
			el.src = el.dataset.src
		}

		if (el.dataset.srcset && !el.srcset) {
			el.srcset = el.dataset.srcset
		}
	}

	if (img.parentNode.tagName === 'PICTURE') {
		Array.from(img.parentNode.children).forEach((el) => {
			setImageAttr(el)
		})
	} else {
		setImageAttr(img)
	}
}

setTimeout(() => {
	requestAnimationFrame(initLazyImages);
  }, 0);
window.initLazyScript = initLazyScript