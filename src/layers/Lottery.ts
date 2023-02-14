import { Sprite, Cache, AnimatedSprite, Text } from 'pixi.js'
import Chest from '../components/Chest'
import Button from '../components/Button'
import Layer from '../sys/Layer'
import { createSpriteAnimation } from '../utils/utils'
import * as TWEEN from '@tweenjs/tween.js'

class Lottery extends Layer {
    private gameW: number = this.game.renderer.options.width as number
    private gameH: number = this.game.renderer.options.height as number
    private chestArray: Chest[] = []
    private playBtn!: Button
    private openChestAnimation!: AnimatedSprite
    private gotoBonusAnimation!: AnimatedSprite
    private noWinTextSprite!: Sprite
    private winTextSprite!: Sprite
    private winAmountText!: Text

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
        this.createSpriteAnimations()

        const winingTextSpritePosition: { x: number, y: number } = {
            x: this.gameW / 2,
            y: this.gameH / 2 - 100
        }

        this.noWinTextSprite = this.createWiningTextSprite('no_win.png', winingTextSpritePosition)
        this.winTextSprite = this.createWiningTextSprite('win.png', winingTextSpritePosition)

        this.addChild(this.noWinTextSprite)
        this.addChild(this.winTextSprite)

        this.winAmountText = new Text('', { fontSize: 50 })
        this.winAmountText.anchor.set(.5)
        this.winAmountText.position.x = this.winTextSprite.position.x
        this.winAmountText.position.y = this.winTextSprite.position.y + 80
        this.winAmountText.alpha = 0
        this.winAmountText.visible = false

        this.addChild(this.winAmountText)

        this.sortChildren()
    }

    createWiningTextSprite(src: string, position: { x: number, y: number }): Sprite {
        const textSprite = new Sprite(Cache.get(src))
        textSprite.anchor.set(.5)
        textSprite.position.x = position.x
        textSprite.position.y = position.y
        textSprite.alpha = 0
        textSprite.visible = false
        return textSprite
    }

    createSpriteAnimations(): void {
        this.openChestAnimation = createSpriteAnimation('1_', 9)
        this.addChild(this.openChestAnimation)

        this.gotoBonusAnimation = createSpriteAnimation('2_', 9)
        this.gotoBonusAnimation.scale.set(2)
        this.gotoBonusAnimation.position.x = this.gameW / 2
        this.gotoBonusAnimation.position.y = this.gameH / 2
        this.addChild(this.gotoBonusAnimation)
    }

    activateChests(): void {
        this.chestArray.forEach((chest) => {
            chest.activate()
            chest.on('click', () => {
                this.disableAllChest()
                this.playOpenChestAnimation(chest).then(() => {
                    chest.disable()
                    const { haveWin, amount, bonus }: { haveWin: boolean, amount: number, bonus: boolean } = chest.open()
                    if (haveWin) {
                        if (bonus) {
                            this.goToBonusLayer(amount)
                        } else {
                            this.winAmountText.text = `${amount}$`
                            this.winTextSprite.visible = true
                            this.winAmountText.visible = true
                            this.showWinningsText('win').then(() => this.afterShowWinningsTexts())
                        }
                    } else {
                        this.noWinTextSprite.visible = true
                        this.showWinningsText('no_win').then(() => this.afterShowWinningsTexts())
                    }
                })
            })
        })
    }

    afterShowWinningsTexts(): void {
        this.winTextSprite.visible = false
        this.noWinTextSprite.visible = false
        this.winAmountText.visible = false
        this.winAmountText.text = ''
        if (!this.checkForActiveChests()) {
            this.resetLayer()
            this.game.layers.setActive('menu', true)
        } else {
            this.activateAllChest()
        }
    }

    disableAllChest(): void {
        this.chestArray.forEach((chest) => {
            chest.disable()
        })
    }

    activateAllChest(): void {
        this.chestArray.forEach((chest) => {
            chest.activate()
        })
    }

    showWinningsText(textType: string): Promise<void> {
        return new Promise((res) => {
            const alpha: { value: number } = { value: 0 }
            new TWEEN.Tween(alpha)
                .to({ value: 1 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .yoyo(true)
                .repeat(1)
                .onUpdate(() => {
                    const { value } = alpha
                    if (textType === 'no_win') this.noWinTextSprite.alpha = value
                    else {
                        this.winTextSprite.alpha = value
                        this.winAmountText.alpha = value
                    }
                })
                .onComplete(() => res())
                .start()
        })

    }

    goToBonusLayer(winAmount: number): void {
        this.gotoBonusAnimation.visible = true
        this.gotoBonusAnimation.gotoAndPlay(0)
        this.gotoBonusAnimation.onComplete = () => {
            this.game.layers.setActive('bonus-win', true, winAmount)
        }
    }

    playOpenChestAnimation(chest: Chest): Promise<void> {
        return new Promise((res) => {
            if (this.openChestAnimation) {
                this.openChestAnimation.visible = true
                this.openChestAnimation.position.set(chest.position.x, chest.position.y)
                this.openChestAnimation.gotoAndPlay(0)
                this.openChestAnimation.onComplete = () => {
                    if (this.openChestAnimation) {
                        this.openChestAnimation.visible = false
                        res()
                    }
                }
            }
        })
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

    onStart(fromBonus: any): void {
        if (typeof fromBonus[0] === 'boolean') {
            if (fromBonus[0]) {
                if (this.gotoBonusAnimation) this.gotoBonusAnimation.visible = false;

                this.afterShowWinningsTexts()
            }
        }
    }

    onUpdate(delta: number, ms: number): void {
        super.onUpdate(delta, ms)
        TWEEN.update()
    }

    resetLayer(): void {
        TWEEN.removeAll()
        this.chestArray.forEach((chest) => {
            chest.reset()
        })
        this.playBtn.activate()
    }
}
export default Lottery