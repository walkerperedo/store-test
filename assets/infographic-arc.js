if (!customElements.get('arc-diagram')) {
	customElements.define(
		'arc-diagram',
		class ArcDiagram extends HTMLElement {
			constructor() {
				super()
				this.svgNS = 'http://www.w3.org/2000/svg'
				this.arcGroup = this.querySelector('#arcGroup')
				this.arcSteps = this.querySelectorAll('.arc-step')

				this.steps = this.arcSteps.length

				this.centerX = 50
				this.centerY = 50
				this.radius = 50

				this.startAngle = -135
				this.endAngle = 135
				this.init()
			}
			init() {
				const positions = [
					{ label: { x: -12, y: 20 }, text: { x: -266, y: 79.64 }, node: { x: 14.64, y: 14.64 } },
					{ label: { x: -21.5, y: 50 }, text: { x: -321.36, y: 340.64 }, node: { x: 0.02, y: 53.82 } },
					{ label: { x: -3, y: 80 }, text: { x: -215.36, y: 570 }, node: { x: 18.3, y: 88.55 } },
					{ label: { x: 104.5, y: 50 }, text: { x: 620, y: 570 }, node: { x: 82.7, y: 88.55 } },
					{ label: { x: 121, y: 30 }, text: { x: 720, y: 340.64 }, node: { x: 100, y: 53.82 } },
					{ label: { x: 112.5, y: 30 }, text: { x: 661.5, y: 79.64 }, node: { x: 85.36, y: 14.6 } },
				]
				const steps = this.steps
				const startAngle = this.startAngle
				const endAngle = this.endAngle
				const centerX = this.centerX
				const centerY = this.centerY
				const radius = this.radius
				const arcGroup = this.arcGroup

				for (let i = 0; i < steps; i++) {
					const angle = startAngle + (i / (steps - 1)) * (startAngle - endAngle)
					const radians = (angle * Math.PI) / 180

					const x = centerX + radius * Math.cos(radians)
					const y = centerY + radius * Math.sin(radians)

					// Circle
					const circle = this.createCircle(positions[i].node.x, positions[i].node.y)
					arcGroup.appendChild(circle)

					// Number
					const number = this.createNumber(positions[i].node.x, positions[i].node.y, i + 1)
					arcGroup.appendChild(number)

					// arc step position
					const arcStep = this.arcSteps[i]
					arcStep.style.left = `${positions[i].text.x}px`
					arcStep.style.top = `${positions[i].text.y}px`

					if (i < 3){
						arcStep.classList.add('text-right')
					}
					// Label
					// const label = this.createLabel(positions[i].label.x, positions[i].node.y, steps[i].title)
					// arcGroup.appendChild(label)

					// Text
					// const text = this.createText(positions[i].text.x, positions[i].node.y + 5, steps[i].text, i >= 3 ? 'start' : 'end')
					// arcGroup.appendChild(text)
				}
			}
			createCircle(x, y) {
				const node = document.createElementNS(this.svgNS, 'circle')
				node.setAttribute('cx', x.toFixed(2))
				node.setAttribute('cy', y.toFixed(2))
				node.setAttribute('r', 4.5)
				return node
			}
			createNumber(x, y, numberText) {
				const number = document.createElementNS(this.svgNS, 'text')
				number.setAttribute('x', x.toFixed(2))
				number.setAttribute('y', y.toFixed(2))
				number.setAttribute('text-anchor', 'middle')
				number.setAttribute('dominant-baseline', 'middle')
				number.setAttribute('fill', 'white')
				number.setAttribute('font-size', '3')
				number.setAttribute('font-family', 'condensed')
				number.setAttribute('font-weight', 'bold')
				number.setAttribute('letter-spacing', '0')
				number.textContent = `${String(numberText).padStart(2, '0')}.`
				return number
			}
			// createLabel(x, y, text) {
			// 	const label = document.createElementNS(this.svgNS, 'text')
			// 	label.setAttribute('x', x)
			// 	label.setAttribute('y', y)
			// 	label.setAttribute('font-size', '4')
			// 	label.setAttribute('text-anchor', 'middle')
			// 	label.setAttribute('alignment-baseline', 'middle')
			// 	label.setAttribute('font-weight', 'bold')
			// 	label.setAttribute('fill', 'black')
			// 	label.setAttribute('font-family', 'condensed')
			// 	label.setAttribute('letter-spacing', '0')
			// 	label.textContent = text
			// 	return label
			// }
			// createText(x, y, text, position) {
			// 	const textNode = document.createElementNS(this.svgNS, 'text')
			// 	textNode.setAttribute('x', x)
			// 	textNode.setAttribute('y', y)
			// 	textNode.setAttribute('text-anchor', position)
			// 	textNode.setAttribute('font-size', '2')
			// 	textNode.setAttribute('font-family', 'condensed')
			// 	textNode.setAttribute('fill', '#777777')
			// 	textNode.setAttribute('font-weight', 'normal')
			// 	textNode.setAttribute('letter-spacing', '0')

			// 	const maxCharsPerLine = 39
			// 	const lines = this.wrapTextByWords(text, maxCharsPerLine)

			// 	lines.forEach((line, i) => {
			// 		const tspan = document.createElementNS(this.svgNS, 'tspan')
			// 		tspan.setAttribute('x', x)
			// 		tspan.setAttribute('dy', i === 0 ? '0' : '1.2em')
			// 		tspan.textContent = line
			// 		textNode.appendChild(tspan)
			// 	})

			// 	return textNode
			// }

			// wrapTextByWords(text, maxChars) {
			// 	const words = text.split(' ')
			// 	const lines = []
			// 	let currentLine = ''

			// 	for (const word of words) {
			// 		if ((currentLine + word).length <= maxChars) {
			// 			currentLine += (currentLine ? ' ' : '') + word
			// 		} else {
			// 			if (currentLine) lines.push(currentLine)
			// 			currentLine = word
			// 		}
			// 	}
			// 	if (currentLine) lines.push(currentLine)

			// 	return lines
			// }
		}
	)
}
