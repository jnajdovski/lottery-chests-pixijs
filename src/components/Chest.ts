import { Texture } from "pixi.js";
import { getWinData } from "../utils/utils";
import Button from "./Button";

class Chest extends Button {
    private oppened: boolean = false
    constructor(texture: Texture, x: number, y: number, type: string) {
        super(texture, x, y, type)
    }

    public open(): { haveWin: boolean, amount: number, bonus: boolean } {
        this.oppened = true
        let winData: { haveWin: boolean, amount: number, bonus: boolean } = getWinData()
        return winData
    }

    public reset() {
        this.oppened = false
        this.disable()
    }

    public activate(): void {
        if (!this.oppened) super.activate()
    }

    public isActive(): boolean {
        if (!super.isActive() && this.oppened) return false
        return true
    }
}
export default Chest