import { makeAutoObservable } from "mobx";
import type { TopShapeId } from "../types/table.types";

const DEFAULT_LENGTH = 3100;
const DEFAULT_WIDTH = 1300;
export class TableTopManager {

    length = 3180;
    width = 1300;
    id: TopShapeId = 'rectangle';
    materialId: string = 'amani_grey';
    availableShapes: TopShapeId[] = ['capsule', 'oblong', 'oval', 'rectangle'];
    availableMaterials = ['amani_grey', 'anatolia', 'aristocrat', 'autumn_bronze', 'calacatta_black', 'calacatta_lux', 'cartier_gold', 'desert_dune', 'elegance', 'fior', 'gold_onyx', 'ivory', 'kenya', 'lucid', 'magma', 'mont_blanc_texture', 'moss_blanc', 'mother_earth', 'noce', 'orova', 'pearl_mist', 'pietra_stone', 'premium_gold', 'roman', 'shadow_white', 'sienna_bronze', 'skye', 'storm', 'taj_mahal', 'twilight', 'velvet', 'velvet_black', 'veneto', 'venus_vein', 'vintage_bronze', 'wild_forest'];
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setLength(length: number) {
        const validLengths = this.getValidLengths();
        const closest = validLengths.reduce((prev, curr) =>
            Math.abs(curr - length) < Math.abs(prev - length) ? curr : prev
        );

        this.length = closest;

        if (this.id === 'round' || this.id === 'square') {
            this.width = this.length;
        }
    }

    setWidth(width: number) {
        if (this.id === 'round' || this.id === 'square') {
            this.width = this.length;
            return;
        }

        const validWidths = this.getValidWidths();
        const closest = validWidths.reduce((prev, curr) =>
            Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
        );
        this.width = closest;
    }

    setShape(id: TopShapeId) {
        this.id = id;
        this.setLength(this.length);
    }

    getMinLength() {
        const valid = this.getValidLengths();
        return valid[0];
    }

    getMaxLength() {
        const valid = this.getValidLengths();
        return valid[valid.length - 1];
    }

    getValidLengths() {
        if (this.id === 'round' || this.id === 'square') {
            return [1200, 1300, 1400, 1500, 1580];
        }
        // Others: 1600 to 3100 in 100 steps, plus 3180
        const lengths = [];
        for (let l = 1600; l <= 3100; l += 100) {
            lengths.push(l);
        }
        lengths.push(3180);
        return lengths;
    }

    getValidWidths() {
        if (this.id === 'round' || this.id === 'square') {
            return this.getValidLengths();
        }
        const widths = [];
        for (let w = 800; w <= 1300; w += 50) {
            widths.push(w);
        }
        return widths;
    }



    // Precise implementation of the requested table
    getCapacityStats() {
        const l = this.length;

        // Round
        if (this.id === 'round') {
            if (l <= 1200) return { tight: 6, comfort: 6 };
            if (l <= 1300) return { tight: 6, comfort: 6 };
            if (l <= 1400) return { tight: 7, comfort: 6 };
            if (l <= 1500) return { tight: 7, comfort: 7 };
            return { tight: 8, comfort: 7 };
        }

        // Square
        if (this.id === 'square') {
            if (l <= 1300) return { tight: 6, comfort: 6 };
            return { tight: 8, comfort: 8 };
        }

        // Rectangle
        if (l <= 1400) return { tight: 6, comfort: 4 };
        if (l <= 1700) return { tight: 6, comfort: 6 };
        if (l <= 1900) return { tight: 8, comfort: 6 };
        if (l <= 2300) return { tight: 8, comfort: 8 };
        if (l <= 2500) return { tight: 10, comfort: 8 };
        if (l <= 2900) return { tight: 10, comfort: 10 };
        if (l <= 3000) return { tight: 12, comfort: 10 };
        return { tight: 12, comfort: 12 };
    }

    getPrice(): number {
        const l = this.length;

        // Round
        if (this.id === 'round') {
            if (l <= 1200) return 2290;
            if (l <= 1300) return 2480;
            if (l <= 1400) return 2750;
            if (l <= 1500) return 2980;
            if (l <= 1580) return 2980;
            return 2980; // Fallback for >1580 if allowed
        }

        // Square
        if (this.id === 'square') {
            if (l <= 1200) return 2190;
            if (l <= 1300) return 2380;
            if (l <= 1400) return 2650;
            if (l <= 1500) return 2880;
            if (l <= 1580) return 2880;
            return 2880; // Fallback
        }

        // Rectangular / Others (Oblong, Oval, Capsule)
        // 1600-2200 length = £2880
        if (l <= 2200) return 2880;

        // 2250-2450 length = £3312
        if (l <= 2450) return 3312;

        // 2500-2850 length = £3576
        if (l <= 2850) return 3576;

        // 2900-3180 length = £3840
        return 3840;
    }

    getSeatCapacity(): string {
        const stats = this.getCapacityStats();
        if (stats.comfort === stats.tight) {
            return `Comfortable: ${stats.comfort} Chairs`;
        }
        return `Comfortable: ${stats.comfort} | Compact: ${stats.tight} Chairs`;
    }

    setMaterial(materialId: string) {
        this.materialId = materialId;
    }



    getAvailableMaterals(): string[] {
        return this.availableMaterials;
    }

    reset() {
        this.length = DEFAULT_LENGTH;
        this.width = DEFAULT_WIDTH;
        this.id = 'rectangle';
        this.materialId = 'amani_grey';
    }

    resetDimensions() {
        this.setLength(DEFAULT_LENGTH);
        this.setWidth(DEFAULT_WIDTH);
    }

    serialize() {
        return {
            length: this.length,
            width: this.width,
            materialId: this.materialId,
            availableShapes: this.availableShapes,
            availableMaterials: this.availableMaterials
        }
    }

}
