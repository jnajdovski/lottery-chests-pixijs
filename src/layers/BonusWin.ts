import { AnimatedSprite, Cache, Sprite, Text } from 'pixi.js';
import { createSpriteAnimation } from '../utils/utils';
import Layer from '../sys/Layer';
import * as TWEEN from '@tweenjs/tween.js'

class BonusWin extends Layer {
    private gameW: number = this.game.renderer.options.width as number
    private gameH: number = this.game.renderer.options.height as number
    private leftWinAnimation!: AnimatedSprite
    private rightWinAnimation!: AnimatedSprite
    private winAmount: number = 0
    private winAmountText!: Text
    private bonusWin!: Sprite

    onCreate(): void {
        const background = new Sprite(Cache.get('3_game_background.jpg'))
        background.width = this.gameW
        background.height = this.gameH
        this.addChild(background)

        this.bonusWin = new Sprite(Cache.get('bonus_win.png'))
        this.bonusWin.anchor.set(.5)
        this.bonusWin.position.x = this.gameW / 2
        this.bonusWin.position.y = this.gameH / 2 - 100

        this.addChild(this.bonusWin)

        this.leftWinAnimation = createSpriteAnimation('Midas', 8)
        this.leftWinAnimation.scale.set(4)
        this.leftWinAnimation.loop = true
        this.leftWinAnimation.position.set(this.gameW / 2 - 200, this.gameH / 2 - 100)

        this.addChild(this.leftWinAnimation)

        this.rightWinAnimation = createSpriteAnimation('Midas', 8)
        this.rightWinAnimation.loop = true
        this.rightWinAnimation.scale.set(-4, 4)
        this.rightWinAnimation.position.set(this.gameW / 2 + 200, this.gameH / 2 - 100)

        this.addChild(this.rightWinAnimation)

        this.winAmountText = new Text('', { fontSize: 80, stroke: 2, strokeThickness: 2 })
        this.winAmountText.anchor.set(.5)
        this.winAmountText.position.x = this.bonusWin.position.x
        this.winAmountText.position.y = this.bonusWin.position.y + 180
        this.winAmountText.visible = false
        this.addChild(this.winAmountText)
    }

    onStart(winAmount: any[]): void {
        this.winAmount = winAmount[0]
        this.winAmountText.text = `${winAmount[0]}$`

        this.playWiningAnimations().then(() => {
            TWEEN.removeAll()
            this.game.layers.setActive('lottery', true, true)
        })
    }

    playWiningAnimations(): Promise<void> {
        return new Promise((res) => {
            this.winAmountText.visible = true
            this.leftWinAnimation.visible = true
            this.leftWinAnimation.gotoAndPlay(0)

            this.rightWinAnimation.visible = true
            this.rightWinAnimation.gotoAndPlay(0)
            const bonusWinScale: { x: number, y: number } = this.bonusWin.scale
            new TWEEN.Tween(bonusWinScale)
                .to({ x: 1.5, y: 1.5 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .yoyo(true)
                .repeat(5)
                .onUpdate(() => {
                    const { x, y } = bonusWinScale
                    this.bonusWin.scale.set(x, y)
                })
                .onComplete(() => res())
                .start()
        })
    }

    onUpdate(delta: number, ms: number): void {
        super.onUpdate(delta, ms)
        TWEEN.update()
    }
}
export default BonusWin