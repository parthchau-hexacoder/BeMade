import { makeAutoObservable, reaction } from "mobx";
import { TableTopManager } from "../tables/TableTopManager";
import type { TableBaseManager } from "../tables/TableBaseManager";

export type ChairTransform = {
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
};

type SeatDistribution = {
  longSide: number;
  shortSide: number;
};


export class ChairPositionManager {
  totalChairs = 0;
  chairOffset = 0.45;
  tableTop: TableTopManager;
  tableBase: TableBaseManager;

  constructor(tableTop: TableTopManager, tableBase: TableBaseManager) {
    this.tableTop = tableTop;
    this.tableBase = tableBase;
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => [this.tableTop.length, this.tableBase.id, this.tableTop.id],
      () => {
        const max = this.getMaxAllowedChairs();
        if (this.totalChairs > max) {
          this.totalChairs = max;
        }
      }
    );
  }

  getMaxAllowedChairs(): number {
    const stats = this.tableTop.getCapacityStats();
    let limit = stats.tight;

    if (this.tableBase.id === 'linea-dome') {
      let baseLimit = 8;

      if ((this.tableTop.id === 'round' || this.tableTop.id === 'square') && this.tableTop.length < 1400) {
        baseLimit = 6;
      }

      limit = Math.min(limit, baseLimit);
    }

    return limit;
  }

  setTotalChairs(count: number) {
    const max = this.getMaxAllowedChairs();

    if (count > max) {
      this.totalChairs = max;
      return;
    }

    if (count % 2 === 0 && count >= 0 && count <= 12) {
      this.totalChairs = count;
    }
  }

  get chairTransforms(): ChairTransform[] {
    switch (this.tableTop.id) {
      case "rectangle":
      case "oblong":
      case "capsule":
      case "oval":
        return this.computeRectangleLikeChairs();

      case "round":
        return this.computeCircleChairs();

      case "square":
        return this.computeSquareChairs();

      default:
        return [];
    }
  }

  private computeCircleChairs(): ChairTransform[] {
    const radius =
      this.tableTop.length / 2000 + this.chairOffset;

    const step = (Math.PI * 2) / this.totalChairs;

    return Array.from({ length: this.totalChairs }).map((_, i) => {
      const angle = i * step;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      return {
        index: i,
        position: [x, 0, z],
        rotation: [0, -angle - Math.PI / 2, 0],
      };
    });
  }


  private computeRectangleLikeChairs(): ChairTransform[] {
    const { longSide, shortSide } = this.resolveSeatDistribution(this.totalChairs);

    const halfX = this.tableTop.length / 2000;
    const halfZ = this.tableTop.width / 2000;
    const o = this.chairOffset;

    const result: ChairTransform[] = [];
    let index = 0;

    const spacing = 1 / (longSide + 1);

    for (let i = 0; i < longSide; i++) {
      const t = (i + 1) * spacing;
      const x = -halfX + t * (halfX * 2);

      result.push({
        index: index++,
        position: [x, 0, -halfZ - o],
        rotation: [0, 0, 0],
      });
    }

    for (let i = 0; i < longSide; i++) {
      const t = (i + 1) * spacing;
      const x = -halfX + t * (halfX * 2);

      result.push({
        index: index++,
        position: [x, 0, halfZ + o],
        rotation: [0, Math.PI, 0],
      });
    }

    if (shortSide === 1) {
      result.push({
        index: index++,
        position: [halfX + o, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
      });

      result.push({
        index: index++,
        position: [-halfX - o, 0, 0],
        rotation: [0, Math.PI / 2, 0],
      });
    }

    return result;
  }

  private computeSquareChairs(): ChairTransform[] {
    const half = this.tableTop.length / 2000;
    const o = this.chairOffset;

    const total = this.totalChairs;
    const base = Math.floor(total / 4);
    const remainder = total % 4;

    const perSide: number[] = [base, base, base, base];

    if (remainder === 1) {
      perSide[0]++;
    } else if (remainder === 2) {
      perSide[0]++;
      perSide[2]++;
    } else if (remainder === 3) {
      perSide[0]++;
      perSide[1]++;
      perSide[2]++;
    }

    const result: ChairTransform[] = [];
    let index = 0;

    const addTop = (count: number) => {
      if (count <= 0) return;
      const spacing = 1 / (count + 1);
      for (let i = 0; i < count; i++) {
        const t = (i + 1) * spacing;
        const x = -half + t * (half * 2);
        result.push({ index: index++, position: [x, 0, -half - o], rotation: [0, 0, 0] });
      }
    };

    const addRight = (count: number) => {
      if (count <= 0) return;
      const spacing = 1 / (count + 1);
      for (let i = 0; i < count; i++) {
        const t = (i + 1) * spacing;
        const z = -half + t * (half * 2);
        result.push({ index: index++, position: [half + o, 0, z], rotation: [0, -Math.PI / 2, 0] });
      }
    };

    const addBottom = (count: number) => {
      if (count <= 0) return;
      const spacing = 1 / (count + 1);
      for (let i = 0; i < count; i++) {
        const t = (i + 1) * spacing;
        const x = half - t * (half * 2);
        result.push({ index: index++, position: [x, 0, half + o], rotation: [0, Math.PI, 0] });
      }
    };

    const addLeft = (count: number) => {
      if (count <= 0) return;
      const spacing = 1 / (count + 1);
      for (let i = 0; i < count; i++) {
        const t = (i + 1) * spacing;
        const z = half - t * (half * 2);
        result.push({ index: index++, position: [-half - o, 0, z], rotation: [0, Math.PI / 2, 0] });
      }
    };

    addTop(perSide[0]);
    addRight(perSide[1]);
    addBottom(perSide[2]);
    addLeft(perSide[3]);

    return result;
  }

  private resolveSeatDistribution(total: number): SeatDistribution {

    if (total == 0) {
      return { longSide: 0, shortSide: 0 };
    }

    if (total <= 2) {
      return { longSide: 1, shortSide: 0 };
    }

    if (total <= 4) {
      return { longSide: 1, shortSide: 1 };
    }

    if (total <= 6) {
      return { longSide: 2, shortSide: 1 };
    }

    if (total <= 8) {
      return { longSide: 3, shortSide: 1 };
    }

    if (total <= 10) {
      return { longSide: 4, shortSide: 1 };
    }

    return { longSide: 5, shortSide: 1 };
  }
}
