import * as THREE from "three";

export const applyTextureCut = (
  texture: THREE.Texture | null | undefined,
  repeat: [number, number]
) => {
  if (!texture) return;
  const [repeatX, repeatY] = repeat;
  const last = texture.userData?.cutRepeat as [number, number] | undefined;
  if (last && last[0] === repeatX && last[1] === repeatY) {
    return;
  }

  let needsUpdate = false;

  if (texture.wrapS !== THREE.ClampToEdgeWrapping) {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    needsUpdate = true;
  }
  if (texture.wrapT !== THREE.ClampToEdgeWrapping) {
    texture.wrapT = THREE.ClampToEdgeWrapping;
    needsUpdate = true;
  }

  texture.repeat.set(repeatX, repeatY);
  texture.offset.set((1 - repeatX) / 2, (1 - repeatY) / 2);
  texture.userData = {
    ...texture.userData,
    cutRepeat: [repeatX, repeatY],
  };

  if (needsUpdate) {
    texture.needsUpdate = true;
  }
};
