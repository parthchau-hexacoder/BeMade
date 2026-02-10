import { makeAutoObservable } from "mobx";
import { ChairManager } from "./chairs/ChairManager";
import { TableManager } from "./tables/TableManager";

export class DesignManager {

    table: TableManager;
    chair: ChairManager;

    constructor() {
        this.table = new TableManager();
        this.chair = new ChairManager(this.table.top, this.table.base);

        makeAutoObservable(this, {}, { autoBind: true });
    }

    reset() {
        this.table.reset();
        this.chair.reset();
    }

    serialize() {
        return {
            table: this.table,
            chair: this.chair
        }
    }
}