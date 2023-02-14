import { AnimatedSprite, Cache, Texture } from "pixi.js"

export const getWinData = (): { haveWin: boolean, amount: number, bonus: boolean } => {
    if (haveWin()) {
        const bonus = isBonus()
        const amount = bonus ? getWinAmount() * 4 : getWinAmount()
        return {
            haveWin: true,
            amount,
            bonus
        }
    }

    return {
        haveWin: false,
        amount: 0,
        bonus: false
    }
}

export const isBonus = (): boolean => {
    return Math.random() <= 0.5 ? true : false
}

export const haveWin = (): boolean => {
    return Math.random() <= 0.5 ? true : false
}

export const getWinAmount = (): number => {
    return Math.floor(Math.random() * (800 - 500 + 1) + 500)
}

export const createSpriteAnimation = (animName: string, numOfFrames: number): AnimatedSprite => {
    const openAnimationTextures: Texture[] = []
    for (let i = 0; i < numOfFrames; i++) {
        const animTexture = Cache.get(`${animName}${i + 1}.png`)
        openAnimationTextures.push(animTexture)
    }

    const animation: AnimatedSprite = new AnimatedSprite(openAnimationTextures)
    animation.animationSpeed = 0.6
    animation.loop = false
    animation.anchor.set(.5)
    animation.visible = false

    return animation
}