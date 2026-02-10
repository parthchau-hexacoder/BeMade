import * as THREE from 'three'
export function setupTexture(
  texture: THREE.Texture,
  {
    repeat = [1, 1],
    colorSpace,
  }: {
    repeat?: [number, number];
    colorSpace?: THREE.ColorSpace;
  } = {}
) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(repeat[0], repeat[1]);
  texture.flipY = false;

  if (colorSpace) {
    texture.colorSpace = colorSpace;
  }

  texture.needsUpdate = true;
  return texture;
}
