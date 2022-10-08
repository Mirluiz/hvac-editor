import {IVec} from "../../Geometry/vect";

class CanvasModel {
    mouse: IVec | null = null
    clicked: boolean = false
    keyboard: string | null = null
    offset: IVec = {x: 0, y: 0}
    config: IConfig = {
        net: {
            show: true,
            step: 20
        }
    }
}

interface IConfig {
    net: {
        show: boolean
        step: 15 | 20 | 50
    }
}

export default CanvasModel
