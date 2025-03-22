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

window.initLazyScript = initLazyScript
