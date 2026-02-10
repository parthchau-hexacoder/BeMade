import { makeAutoObservable } from "mobx";
import { ChairManager } from "./chairs/ChairManager";
import { TableManager } from "./tables/TableManager";
import { DESIGN_STORAGE_KEY } from "../../app/constants/storage";
import type { BaseShape, TopShapeId } from "./types/table.types";
import type { chairShape } from "./chairs/ChairManager";

type PersistedDesignPayload = {
    table?: {
        top?: {
            id?: TopShapeId;
            length?: number;
            width?: number;
            materialId?: string;
        };
        base?: {
            id?: BaseShape;
            materialId?: string;
        };
    };
    chair?: {
        id?: chairShape;
        materialId?: string;
        totalChairs?: number;
    };
    samples?: string[];
};

const BASE_SHAPES: BaseShape[] = [
    "axis",
    "cradle",
    "curva",
    "linea",
    "linea-contour",
    "linea-dome",
    "moon",
    "twiste",
];

export class DesignManager {

    table: TableManager;
    chair: ChairManager;
    samples: string[] = [];
    checkoutPreviewImage: string | null = null;

    constructor() {
        this.table = new TableManager();
        this.chair = new ChairManager(this.table.top, this.table.base);

        makeAutoObservable(this, {}, { autoBind: true });
        this.hydrateFromLocalStorage();
    }

    reset() {
        this.table.reset();
        this.chair.reset();
        this.samples = [];
        this.checkoutPreviewImage = null;
    }

    toggleSample(id: string) {
        if (this.samples.includes(id)) {
            this.samples = this.samples.filter((item) => item !== id);
            return;
        }
        this.samples = [...this.samples, id];
    }

    clearSamples() {
        this.samples = [];
    }

    setCheckoutPreviewImage(image: string | null) {
        this.checkoutPreviewImage = image;
    }

    get samplesPrice() {
        const count = this.samples.length;
        if (count === 0) return 0;
        return Math.ceil(count / 2) * 20;
    }

    serialize() {
        return {
            table: this.table,
            chair: this.chair,
            samples: this.samples
        }
    }

    private hydrateFromLocalStorage() {
        if (typeof window === "undefined") return;

        const raw = window.localStorage.getItem(DESIGN_STORAGE_KEY);
        if (!raw) return;

        try {
            const payload = JSON.parse(raw) as PersistedDesignPayload;
            this.applyPersistedPayload(payload);
        } catch {
            // Ignore malformed data and keep current defaults.
        }
    }

    private applyPersistedPayload(payload: PersistedDesignPayload) {
        const base = payload.table?.base;
        const top = payload.table?.top;
        const chair = payload.chair;

        if (base?.id && BASE_SHAPES.includes(base.id)) {
            this.table.base.setShape(base.id);
        }
        if (base?.materialId) {
            this.table.base.setMaterialId(base.materialId);
        }

        if (top?.id && this.table.getAvailableShapes().includes(top.id)) {
            this.table.top.setShape(top.id);
        }
        if (typeof top?.length === "number" && Number.isFinite(top.length)) {
            this.table.top.setLength(top.length);
        }
        if (typeof top?.width === "number" && Number.isFinite(top.width)) {
            this.table.top.setWidth(top.width);
        }
        if (top?.materialId && this.table.top.getAvailableMaterals().includes(top.materialId)) {
            this.table.top.setMaterial(top.materialId);
        }

        if (chair?.id && this.chair.getAvailableShapes().includes(chair.id)) {
            this.chair.setShape(chair.id);
        }
        if (chair?.materialId) {
            this.chair.setMaterial(chair.materialId);
        }
        if (typeof chair?.totalChairs === "number" && Number.isFinite(chair.totalChairs)) {
            this.chair.position.setTotalChairs(chair.totalChairs);
        }

        if (Array.isArray(payload.samples)) {
            this.samples = [...new Set(payload.samples.filter((item): item is string => typeof item === "string"))];
        }
    }
}
