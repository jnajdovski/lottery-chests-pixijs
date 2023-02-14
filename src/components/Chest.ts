import { Texture } from "pixi.js";
import { getWinAmount, haveWin, isBonus } from "../utils/utils";
import Button from "./Button";

class Chest extends Button {
    constructor(texture: Texture, x: number, y: number, type: string) {
        super(texture, x, y, type)
    }

    public open() {
        let winData: { amount: number, bonus: boolean } = this.haveReward()
        return winData
    }

    public reset() {
        this.disable()
    }

    private haveReward(): { amount: number, bonus: boolean } {
        return {
            amount: getWinAmount(),
            bonus: isBonus()
        }
    }
}
export default Chest