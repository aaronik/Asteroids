export default class Visuals {
	static hit (canvas: HTMLCanvasElement) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;')
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s')
		}, 100)
	}

	static restartScreen() {
		const wrapper = document.getElementById('restart-screen-wrapper') as HTMLElement
		const el = document.getElementById('restart-screen') as HTMLElement

		// make it visible
		wrapper.setAttribute('style', 'display:block;')

		wrapper.onclick = () => {
			wrapper.setAttribute('style', 'display:none')
		}
	}

	static fadeOut (domEl: HTMLElement, stepValue: number, callback?: () => void) {
		let i = 1

		const interval = setInterval(function(){
			domEl.setAttribute('style', 'opacity:' + i + ';')

			if (i <= 0) {
				clearInterval(interval)
				if (callback) callback()
			}

			i = Math.round((i - stepValue) * 1000) / 1000
		}, 30)

	}

	static fade (domEl: HTMLElement, initialValue: number, finalValue: number, stepValue: number, callback?: () => void) {
		let i = initialValue

		const interval = setInterval(function () {
			domEl.setAttribute('style', 'opacity:' + i + ';')

			const cond1 = (initialValue < finalValue && i >= finalValue)
			const cond2 = (initialValue > finalValue && i <= finalValue)

			if (cond1 || cond2) {
				clearInterval(interval)
				if (callback) callback()
			}

			i = Math.round((i + stepValue) * 1000) / 1000
		}, 30)
	}
}
