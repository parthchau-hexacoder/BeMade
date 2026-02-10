import { makeAutoObservable } from "mobx";

export class SceneManager {
  showGrid = true;
  showHelpers = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
  }
}
