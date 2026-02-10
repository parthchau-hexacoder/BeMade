import { makeAutoObservable } from "mobx";
import { ChairPositionManager } from "./ChairPositionManager";
import { TableTopManager } from "../tables/TableTopManager";
import type { TableBaseManager } from "../tables/TableBaseManager";

export type chairShape = 'aria' | 'siena' | 'vela';

export class ChairManager {

    id: chairShape = 'aria';
    materialId = 'olive';
    availableShapes: chairShape[] = ['aria', 'siena', 'vela'];
    availableMaterials: Record<chairShape, string[]> = {
        aria: ['cream', 'olive', 'tan'],
        siena: ['brown', 'cream', 'pale taupe'],
        vela: ['ecru', 'greige', 'taupe']
    };
    position: ChairPositionManager;

    constructor(tableTop: TableTopManager, tableBase: TableBaseManager) {
        this.position = new ChairPositionManager(tableTop, tableBase);
        makeAutoObservable(this, {}, { autoBind: true });
    }

    getAvailableShapes(): chairShape[] {
        return this.availableShapes;
    }

    getAvailableMaterials(shape?: chairShape): string[] {
        const key = shape ?? this.id;
        return this.availableMaterials[key] ?? [];
    }

    // kept for backwards-compatibility (note: spelling preserved)
    getAvailableMaterals(): string[] {
        return this.getAvailableMaterials();
    }

    getPrice(): number {
        return this.position.totalChairs * 100;
    }

    setShape(id: chairShape) {
        this.id = id;
        const materials = this.getAvailableMaterials(id);
        if (materials.length) this.materialId = materials[0];
    }

    setMaterial(materialId: string) {
        const materials = this.getAvailableMaterials();
        if (materials.includes(materialId)) this.materialId = materialId;
    }

    reset() {
        this.id = 'aria';
        const first = this.getAvailableMaterials('aria')[0];
        this.materialId = first ?? 'olive';
    }

    serialize() {
        return {
            id: this.id,
            materialId: this.materialId
        }
    }
}