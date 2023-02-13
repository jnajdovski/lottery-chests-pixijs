import { Container, Text } from 'pixi.js'
import Game from './Game'

class Layer extends Container {

    readonly key: string

    readonly game: Game

    private isActive: boolean = false
    private fpsCounter: Text | undefined

    constructor(game: Game, key: string) {
        super()
        this.game = game
        this.key = key
        this.fpsCounter = new Text(this.game.ticker.FPS)
        this.addChild(this.fpsCounter)
    }

    onCreate() {
    }

    onStart() {

    }

    onUpdate(delta: number, ms: number) {
        if (this.fpsCounter) {
            this.fpsCounter.text = `FPS: ${Math.floor(this.game.ticker.FPS)}`
        }
    }

    onDestroy() { }

    setActive(active: boolean) {
        this.isActive = active
    }

    getIsActive(): boolean {
        return this.isActive
    }

}

export default Layer