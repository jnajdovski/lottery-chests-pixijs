import Game from "./Game";
import Layer from "./Layer";

interface ILayer {
    new(game: Game, key: string): Layer;
}

class LayerManager {

    readonly game: Game

    readonly list: Array<Layer> = []

    constructor(game: Game) {
        this.game = game
    }

    register(key: string, layerClass: ILayer): Layer {
        let layer = new layerClass(this.game, key)
        this.list.push(layer)
        this.game.stage.addChild(layer)
        layer.onCreate()
        layer.visible = false
        return layer
    }

    setActive(key: string, active: boolean) {
        this.list.forEach((layer) => {
            layer.setActive(layer.key === key ? active : false)
            layer.visible = layer.key === key ? active : false
            if (layer.visible) {
                layer.onStart()
            }
        })
    }

    doUpdate(delta: number, ms: number): void {
        for (let layer of this.list) {
            if (!layer.visible) {
                continue
            }
            layer.onUpdate(delta, ms)
        }
    }

    get(key: string): Layer | null {
        let index = this.list.findIndex(layer => layer.key === key)
        if (index === -1) {
            return null
        }
        return this.list[index]
    }

    destroy(key: string): this {
        let index = this.list.findIndex(layer => layer.key === key)
        if (index !== -1) {
            let [layer] = this.list.splice(index, 1)
            layer.onDestroy()
            this.game.stage.removeChild(layer)
        }
        return this
    }

}

export default LayerManager