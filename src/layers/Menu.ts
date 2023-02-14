import { Sprite, Cache } from 'pixi.js';
import Button from '../components/Button';
import Layer from '../sys/Layer'

class Menu extends Layer {
    private gameW: number = this.game.renderer.options.width as number
    private gameH: number = this.game.renderer.options.height as number

    async onCreate(): Promise<void> {
        const background = new Sprite(Cache.get('1_game_background.jpg'))
        background.width = this.gameW
        background.height = this.gameH
        const startBtn: Button = new Button(Cache.get('button_start.png'), this.gameW / 2, this.gameH / 2, 'start')

        startBtn.on('click', () => {
            this.game.layers.setActive('lottery', true)
        })

        this.addChild(background)
        this.addChild(startBtn)
        this.sortChildren()
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