import { makeAutoObservable, reaction } from "mobx";
import { TableTopManager } from "./TableTopManager";
import { TableBaseManager } from './TableBaseManager'
import type { BaseShape, TopShapeId } from "../types/table.types";

export class TableManager {

    top = new TableTopManager();
    base = new TableBaseManager();

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });

        reaction(() => this.base.id, (id, prevId) => {
            const available = this.getAvailableShapesForBase(id);
            if (!available.includes(this.top.id)) {
                this.top.setShape(available[0]);
            }
            if (prevId === 'linea-dome' && id !== 'linea-dome') {
                this.top.resetDimensions();
            }
        });
    }

    reset() {
        this.top.reset();
        this.base.reset();
    }

    getAvailableShapes(): TopShapeId[] {
        return this.getAvailableShapesForBase(this.base.id);
    }

    private getAvailableShapesForBase(baseId: BaseShape): TopShapeId[] {
        if (baseId === 'linea-dome') {
            return ['square', 'round'];
        }
        return this.top.availableShapes;
    }

    serialize() {
        return {
            top: this.top,
            base: this.base
        }
    }

}
