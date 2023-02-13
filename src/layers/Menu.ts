import Layer from '../sys/Layer'
import LayerManager from '../sys/LayerManager';

class Menu extends Layer {
    private gameW: number = this.game.renderer.options.width as number
    private gameH: number = this.game.renderer.options.height as number

    private layerManager: LayerManager | undefined

    onCreate(): void {
        console.log('Menu Created');

    }

    goToOption(option: string) {
        this.game.layers.setActive(option, true)
    }

    onUpdate(delta: number, ms: number): void {
        super.onUpdate(delta, ms)
    }

    onDestroy(): void {
    }

}

export default Menu