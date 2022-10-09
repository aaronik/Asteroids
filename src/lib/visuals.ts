export default class Visuals {
	static hit (canvas: HTMLCanvasElement) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;')
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s')
		}, 100)
	}
}
