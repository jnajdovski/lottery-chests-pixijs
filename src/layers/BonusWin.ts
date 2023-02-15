import { AnimatedSprite, Cache, Sprite, Text } from 'pixi.js';
import { createSpriteAnimation } from '../utils/utils';
import Layer from '../sys/Layer';
import * as TWEEN from '@tweenjs/tween.js'

class BonusWin extends Layer {
    private gameW: number = this.game.renderer.options.width as number
    private gameH: number = this.game.renderer.options.height as number
    private winAmountText!: Text
    private bonusWin!: Sprite
    private flameAnimations: AnimatedSprite[] = []

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

        this.winAmountText = new Text('', { fontSize: 80, stroke: 2, strokeThickness: 2 })
        this.winAmountText.anchor.set(.5)
        this.winAmountText.position.x = this.bonusWin.position.x
        this.winAmountText.position.y = this.bonusWin.position.y + 180
        this.winAmountText.visible = false
        this.addChild(this.winAmountText)


        let flameAnimXOffset = 100
        for (let i = 0; i < 8; i++) {
            const flameAnimation = createSpriteAnimation('2_', 9)
            flameAnimation.visible = false
            flameAnimation.scale.set(2)
            flameAnimation.position.set(flameAnimXOffset, this.gameH - 80)
            flameAnimXOffset += 200
            this.flameAnimations.push(flameAnimation)
            this.addChild(flameAnimation)
        }

        this.sortChildren()
    }

    onStart(winAmount: any[]): void {
        this.winAmountText.text = `${winAmount[0]}$`

        this.playWiningAnimations().then(() => {
            TWEEN.removeAll()
            this.flameAnimations.forEach((flameAnim) => {
                flameAnim.visible = false
                flameAnim.onComplete = () => {
                    flameAnim.visible = false
                }
            })
            this.game.layers.setActive('lottery', true, true)
        })
    }

    playWiningAnimations(): Promise<void> {
        return new Promise((res) => {
            this.winAmountText.visible = true
            const bonusWinScale: { x: number, y: number } = this.bonusWin.scale
            new TWEEN.Tween(bonusWinScale)
                .to({ x: 1.5, y: 1.5 }, 900)
                .easing(TWEEN.Easing.Quadratic.Out)
                .yoyo(true)
                .repeat(3)
                .onUpdate(() => {
                    const { x, y } = bonusWinScale
                    this.bonusWin.scale.set(x, y)
                })
                .onComplete(() => res())
                .start()
            let flameAnimIterator = 0;
            this.playFlameAnimation(flameAnimIterator)
        })
    }

    playFlameAnimation(flameAnimIterator: number): void {
        if (flameAnimIterator === this.flameAnimations.length) return
        const flameAnim = this.flameAnimations[flameAnimIterator]
        flameAnim.alpha = 1
        flameAnim.visible = true
        flameAnim.gotoAndPlay(0)
        flameAnim.onComplete = () => {
            const alpha: { value: number } = { value: flameAnim.alpha }
            new TWEEN.Tween(alpha)
                .to({ value: 0 }, 100)
                .onUpdate(() => {
                    const { value } = alpha
                    flameAnim.alpha = value
                })
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => { this.playFlameAnimation(++flameAnimIterator) })
                .start()
        }
    }

    onUpdate(delta: number, ms: number): void {
        super.onUpdate(delta, ms)
        TWEEN.update()
    }
}
export default BonusWin