import Menu from './layers/Menu'
import Game from './sys/Game'

class Screen extends Game {
    protected onCreate(): void {
        this.layers.register('menu', Menu)
        this.layers.setActive('menu', true)
    }
}

export default Screen