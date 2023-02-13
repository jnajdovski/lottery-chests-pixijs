import { Application, Ticker } from 'pixi.js'
import LayerManager from './LayerManager'

class Game extends Application {

    private root: HTMLDivElement

    public layers!: LayerManager

    constructor(rootId = 'app') {
        super({
            width: 1280,
            height: 720,
            backgroundColor: 0x308fc7
        })

        this.root = document.getElementById(rootId) as HTMLDivElement

        this.root.append(this.view as HTMLCanvasElement)

        window.onresize = this.onResize
        this.onResize()
    }

    public run() {
        Ticker.shared.add(this.onTick, this)

        this.layers = new LayerManager(this)

        this.onCreate()
    }

    protected onCreate() { }

    private onTick = (dt: number) => {
        this.layers.doUpdate(dt, Ticker.shared.deltaMS)
        // console.log('FPS', this.ticker.FPS);
    }

    private onResize = (event?: Event) => {
        const { width = 0, height = 0 } = this.renderer.options
        let gcd = this.getGCD(width, height)
        let ratio = {
            width: width / gcd,
            height: height / gcd
        }
        let sizeWidth = this.root.clientWidth / ratio.width
        let sizeHeight = this.root.clientHeight / ratio.height
        let root = {
            width: this.root.clientWidth === 0 ? Number.MAX_SAFE_INTEGER : this.root.clientWidth,
            height: this.root.clientHeight === 0 ? Number.MAX_SAFE_INTEGER : this.root.clientHeight,
        }
        let pixelsPerUnit = sizeWidth < sizeHeight ? root.width / ratio.width : root.height / ratio.height
        this.view.width = ratio.width * pixelsPerUnit
        this.view.height = ratio.height * pixelsPerUnit
        this.stage.scale.set(this.view.width / width, this.view.height / height)
        this.renderer.resize(this.view.width, this.view.height)
    }

    private getGCD(width: number, height: number): number {
        return height === 0 ? width : this.getGCD(height, width % height)
    }

}

export default Game