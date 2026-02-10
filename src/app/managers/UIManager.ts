import { makeAutoObservable } from "mobx";

export class UIManager {
  isOrderModalOpen = false;
  isSceneLoading = true;
  hasSceneReady = false;
  activeNavId = "base";
  isFullscreen = false;
  actionMessage: string | null = null;
  sceneContainer: HTMLDivElement | null = null;

  private actionMessageTimeoutId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setOrderModalOpen(open: boolean) {
    this.isOrderModalOpen = open;
  }

  openOrderModal() {
    this.isOrderModalOpen = true;
  }

  closeOrderModal() {
    this.isOrderModalOpen = false;
  }

  setSceneLoading(isLoading: boolean) {
    this.isSceneLoading = isLoading;
  }

  markSceneReady() {
    this.hasSceneReady = true;
  }

  setActiveNavId(id: string) {
    this.activeNavId = id;
  }

  setFullscreen(isFullscreen: boolean) {
    this.isFullscreen = isFullscreen;
  }

  setSceneContainer(container: HTMLDivElement | null) {
    this.sceneContainer = container;
  }

  showActionMessage(message: string, timeoutMs = 2000) {
    this.actionMessage = message;

    if (this.actionMessageTimeoutId !== null) {
      window.clearTimeout(this.actionMessageTimeoutId);
    }

    this.actionMessageTimeoutId = window.setTimeout(() => {
      this.actionMessage = null;
      this.actionMessageTimeoutId = null;
    }, timeoutMs);
  }

  dispose() {
    if (this.actionMessageTimeoutId !== null) {
      window.clearTimeout(this.actionMessageTimeoutId);
      this.actionMessageTimeoutId = null;
    }
  }
}
