import { makeAutoObservable } from "mobx";

export type LightPreset = "studio" | "soft" | "dramatic";

export class LightManager {

  preset: LightPreset = "studio";

  // Global
  hemiIntensity = 0.25;
  ambientIntensity = 0.22;

  // Key contributors
  topIntensity = 0.3;       
  frontFillIntensity = 0.9;  
  backIntensity = 0.35;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.setPreset("studio");
  }

  setPreset(preset: LightPreset) {
    this.preset = preset;

    if (preset === "studio") {
      this.hemiIntensity = 0.25;
      this.ambientIntensity = 0.28;
      this.topIntensity = 1.9;
      this.frontFillIntensity = 1.05;
      this.backIntensity = 0.3;
    }

    if (preset === "soft") {
      this.hemiIntensity = 1.3;
      this.ambientIntensity = 0.3;
      this.topIntensity = 1.2;
      this.frontFillIntensity = 0.7;
      this.backIntensity = 0.25;
    }

    if (preset === "dramatic") {
      this.hemiIntensity = 0.6;
      this.ambientIntensity = 0.1;
      this.topIntensity = 2.0;
      this.frontFillIntensity = 0.4;
      this.backIntensity = 0.7;
    }
  }
}

