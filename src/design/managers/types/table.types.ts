export interface TopShape {
  id: TopShapeId;
  label: string;
  modelPath: string;
}

export type TopShapeId =
  | 'capsule'
  | 'oblong'
  | 'oval'
  | 'rectangle'
  | 'round'
  | 'square';

export type BaseShape = 
    | 'linea'
    | 'moon'
    | 'axis'
    | 'cradle'
    | 'curva'
    | 'linea-contour'
    | 'linea-dome'
    | 'twiste'
;