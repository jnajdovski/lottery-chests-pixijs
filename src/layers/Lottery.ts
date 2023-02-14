import { Sprite, Cache, AnimatedSprite, Texture } from 'pixi.js'
import Chest from '../components/Chest'
import Button from '../components/Button'
import Layer from '../sys/Layer'
import { createSpriteAnimation } from '../utils/utils'

class Lottery extends Layer {
    private gameW: number = this.game.renderer.options.width as number
    private gameH: number = this.game.renderer.options.height as number
    private chestArray: Chest[] = []
    private playBtn!: Button
    private openChestAnimation: AnimatedSprite | undefined

    onCreate(): void {
        const background = new Sprite(Cache.get('2_game_background.jpg'))
        background.width = this.gameW
        background.height = this.gameH
        this.addChild(background)

        this.playBtn = new Button(Cache.get('button_play.png'), this.gameW / 2, this.gameH - 100, 'start')
        this.playBtn.scale.set(.7)
        this.playBtn.on('click', () => {
            this.playBtn.disable()
            this.activateChests()
        })

        const backBtn: Button = new Button(Cache.get('button_left.png'), 100, this.gameH - 100, 'back')
        backBtn.on('click', () => {
            this.resetLayer()
            this.game.layers.setActive('menu', true)
        })

        this.addChild(backBtn)
        this.addChild(this.playBtn)

        this.createChests()
        this.createOpenChestAnimation()
        this.sortChildren()
    }

    createOpenChestAnimation(): void {
        this.openChestAnimation = createSpriteAnimation('1_', 9)
        this.openChestAnimation.onComplete = () => {
            if (this.openChestAnimation) {
                this.openChestAnimation.visible = false
            }
        }
        this.addChild(this.openChestAnimation)
    }

    activateChests(): void {
        this.chestArray.forEach((chest) => {
            chest.activate()
            chest.on('click', () => {
                this.playOpenChestAnimation(chest)
                chest.disable()
                // if (!this.checkForActiveChests()) {
                //     this.playBtn.activate()
                //     this.game.layers.setActive('menu', true)
                // }
                chest.open()
            })
        })
    }

    playOpenChestAnimation(chest: Chest): void {
        if (this.openChestAnimation) {
            this.openChestAnimation.visible = true
            this.openChestAnimation.position.set(chest.position.x, chest.position.y)
            this.openChestAnimation.gotoAndPlay(0)
        }
    }

    createChests(): void {
        let yOffSet = -200
        let yReset = false;
        for (let i = 0; i < 6; i++) {
            const xOffSet = i < 3 ? -200 : 200
            if (i >= 3 && !yReset) {
                yReset = true
                yOffSet = -200
            }
            const chest = new Chest(Cache.get('6.png'), this.gameW / 2 + xOffSet, this.gameH / 2 + yOffSet, `chest_${i}`)
            chest.scale.set(.4)
            chest.disable()
            yOffSet += 150
            this.addChild(chest)
            this.chestArray.push(chest)
        }
    }

    checkForActiveChests(): boolean {
        let haveActiveChests = false
        this.chestArray.forEach((chest) => {
            if (chest.isActive()) {
                haveActiveChests = true
            }
        })
        return haveActiveChests
    }

    onDestroy(): void {

    }
    onStart(): void {

    }
    onUpdate(delta: number, ms: number): void {
        super.onUpdate(delta, ms)
    }

    resetLayer(): void {
        this.chestArray.forEach((chest) => {
            chest.reset()
        })
        this.playBtn.activate()
    }
}
export default Lottery