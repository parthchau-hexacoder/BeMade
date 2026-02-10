import { makeAutoObservable } from "mobx";
import { gsap } from "gsap";

export type CameraViewPreset =
    | "front"
    | "top"
    | "left"
    | "right"
    | "chair"
    | "rightTop"
    | "topWithChairs";

type CameraPose = {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
};

export class CameraManager {

    position: [number, number, number] = [0, 1, 3.7];
    target: [number, number, number] = [0, 0.5, 0];

    fov = 45;
    enableOrbit = false;

    min = 0;
    max = 6;

    currentView: CameraViewPreset = "front";

    private views: Record<CameraViewPreset, CameraPose> = {
        front: { position: [0, 1.1, 3.6], target: [0, 0.6, 0] },
        left: { position: [-3.082351622444384, 0.87, 1], target: [0, 0.6, 0] },
        top: { position: [0, 4.2, 0.01], target: [0, 0, 0], fov: 50 },
        right: { position: [3.45, 0.9, 1.1], target: [0, 0.6, 0] },
        chair: { position: [0, 0.8, 2.0], target: [0, 0.55, 0] },
        rightTop: { position: [3.318, 2.332, 2.438], target: [0.318, 0.332, -0.161], fov: 42 },
        topWithChairs: { position: [0, 4.0, 0.01], target: [0, 0, 0], fov: 52 },
    };

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setView(preset: CameraViewPreset) {
        const pose = this.views[preset];
        this.currentView = preset;
        this.position = pose.position;
        this.target = pose.target;
        this.fov = pose.fov ?? 45;
    }

    animateToView(preset: CameraViewPreset, duration = 1.5) {
        const pose = this.views[preset];
        this.currentView = preset;

        const pos = { x: this.position[0], y: this.position[1], z: this.position[2] };
        const target = { x: this.target[0], y: this.target[1], z: this.target[2] };
        const fov = { value: this.fov };

        gsap.to(pos, {
            x: pose.position[0],
            y: pose.position[1],
            z: pose.position[2],
            duration,
            ease: "power2.out",
            onUpdate: () => this.setPosition(pos.x, pos.y, pos.z),
        });

        gsap.to(target, {
            x: pose.target[0],
            y: pose.target[1],
            z: pose.target[2],
            duration,
            ease: "power2.out",
            onUpdate: () => this.setTarget(target.x, target.y, target.z),
        });

        gsap.to(fov, {
            value: pose.fov ?? 45,
            duration,
            ease: "power2.out",
            onUpdate: () => this.setFov(fov.value),
        });
    }

    getViewPose(preset: CameraViewPreset): CameraPose {
        return this.views[preset];
    }

    setCurrentView(preset: CameraViewPreset) {
        this.currentView = preset;
    }

    setPosition(x: number, y: number, z: number) {
        this.position = [x, y, z];
    }

    setTarget(x: number, y: number, z: number) {
        this.target = [x, y, z];
    }

    setFov(fov: number) {
        this.fov = fov;
    }

    getViewOptions(hasChairs: boolean): CameraViewPreset[] {
        const base: CameraViewPreset[] = ["front", "left", "top", "right"];
        if (!hasChairs) return base;
        return [...base, "chair", "rightTop", "topWithChairs"];
    }
}
