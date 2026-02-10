import { makeAutoObservable } from "mobx";
import { ChairManager } from "./chairs/ChairManager";
import { TableManager } from "./tables/TableManager";

export class DesignManager {

    table: TableManager;
    chair: ChairManager;
    samples: string[] = [];

    constructor() {
        this.table = new TableManager();
        this.chair = new ChairManager(this.table.top, this.table.base);

        makeAutoObservable(this, {}, { autoBind: true });
    }

    reset() {
        this.table.reset();
        this.chair.reset();
        this.samples = [];
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
}
