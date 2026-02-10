import { makeAutoObservable } from "mobx";
import { CameraManager } from "./CameraManager";
import { LightManager } from "./LightManager";
import { SceneManager } from "./SceneManager";

export class Design3DManager {
    
    camera = new CameraManager();
    scene = new SceneManager();
    lights = new LightManager();

    constructor(){
        makeAutoObservable(this, {}, { autoBind:true })
    }

}