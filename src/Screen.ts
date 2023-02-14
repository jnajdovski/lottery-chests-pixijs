import Menu from './layers/Menu'
import Game from './sys/Game'
import Lottery from './layers/Lottery'
import BonusWin from './layers/BonusWin'
import { Assets } from 'pixi.js'

class Screen extends Game {
    protected async onCreate(): Promise<void> {
        await Assets.load('assets/sprites.json')
        this.layers.register('menu', Menu)
        this.layers.register('lottery', Lottery)
        this.layers.register('bonus-win', BonusWin)
        this.layers.setActive('menu', true)
    }
}

export default Screen