import { Sprite, Texture } from "pixi.js";

class Button extends Sprite {
    public type: string = ''
    private active: boolean = false

    constructor(texture: Texture, x: number, y: number, type: string) {
        super(texture)
        this.anchor.set(.5)
        this.position.set(x, y)
        this.type = type
        this.activate()
    }

    public activate(): void {
        this.interactive = true
        this.tint = 0xFFFFFF
        this.active = true

        this.on('mouseover', () => {
            this.tint = 0xe6e493
        })

        this.on('mouseout', () => {
            if (this.active) {
                this.tint = 0xFFFFFF
            }
        })
    }

    public disable(): void {
        this.interactive = false
        this.tint = 0x2b2e2a
        this.active = false
    }

    public isActive(): boolean {
        return this.active
    }

    public setVisibility(visible: boolean): void {
        this.visible = visible
    }
}
export default Button