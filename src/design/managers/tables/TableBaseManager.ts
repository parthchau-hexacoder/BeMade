import { makeAutoObservable } from "mobx";
import type { BaseShape } from "../types/table.types";

type BaseMaterialOption = {
    id: string;
    name: string;
    folder: string;
};

export class TableBaseManager {

    id: BaseShape = 'moon';
    materialId: string = 'moon_clothGrey';
    private availableMaterials: Map<BaseShape, BaseMaterialOption[]> = new Map([
        ['axis', [
            { id: 'axis_graphite', name: 'Graphite', folder: 'graphite' },
            { id: 'axis_cashmereMetal', name: 'Cashmere Metal', folder: 'cashmere_metal' },
        ]],
        ['cradle', [
            { id: 'cradle_champagne', name: 'Champagne', folder: 'champagne' },
            { id: 'cradle_graphite', name: 'Graphite', folder: 'graphite' },
        ]],
        ['curva', [
            { id: 'curva_champagne', name: 'Champagne', folder: 'champagne' },
        ]],
        ['linea', [
            { id: 'linea_gold', name: 'Gold', folder: 'gold' },
            { id: 'linea_bookBlack', name: 'Book Black', folder: 'book_black' },
        ]],
        ['linea-contour', [
            { id: 'lineaCo_gold', name: 'Gold', folder: 'gold' },
            { id: 'lineaCo_CocoaIron', name: 'Cocoa Iron', folder: 'cocoa_iron' },
        ]],
        ['linea-dome', [
            { id: 'lineaDome_gold', name: 'Gold', folder: 'gold' },
            { id: 'lineaDome_CocoaIron', name: 'Cocoa Iron', folder: 'cocoa_iron' },
        ]],
        ['moon', [
            { id: 'moon_clothGrey', name: 'Cloth Grey', folder: 'cloth_grey' },
            { id: 'moon_clothGold', name: 'Cloth Gold', folder: 'cloth_gold' },
        ]],
        ['twiste', [
            { id: 'twiste_brassTeak', name: 'Brass Teak', folder: 'brass_teak' },
        ]],
    ]);


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    private getMaterialsForShape(shape: BaseShape = this.id): BaseMaterialOption[] {
        return this.availableMaterials.get(shape) || [];
    }

    setShape(id: BaseShape) {
        this.id = id;
        this.materialId = this.getMaterialsForShape(id)[0]?.id ?? '';
    }

    setmaterialId(materialId: string) {
        this.setMaterialId(materialId);
    }

    setMaterialId(materialId: string) {
        const valid = this.getMaterialsForShape().some((item) => item.id === materialId);
        if (valid) {
            this.materialId = materialId;
        }
    }

    reset() {
        this.id = 'linea';
        this.materialId = this.getMaterialsForShape('linea')[0]?.id ?? '';
    }

    getAvailableMaterials(): string[] {
        return this.getMaterialsForShape().map((item) => item.id);
    }

    getAvailableMaterialOptions(): BaseMaterialOption[] {
        return this.getMaterialsForShape();
    }

    getMaterialFolder(materialId: string = this.materialId): string {
        const option = this.getMaterialsForShape().find((item) => item.id === materialId);
        return option?.folder ?? materialId;
    }

    getMaterialName(materialId: string = this.materialId): string {
        const option = this.getMaterialsForShape().find((item) => item.id === materialId);
        return option?.name ?? materialId;
    }

    serialize() {
        return {
            id: this.id,
            materialId: this.materialId
        }
    }
}
