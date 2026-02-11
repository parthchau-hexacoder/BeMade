import type { PersistedDesignPayload } from "../../design/managers/DesignManager";

const toBase64Url = (value: string) =>
  value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalized.length % 4;
  if (remainder === 0) return normalized;
  return `${normalized}${"=".repeat(4 - remainder)}`;
};

const encodeUtf8Base64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

const decodeUtf8Base64 = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const encodeDesignPayload = (
  payload: PersistedDesignPayload
): string | null => {
  try {
    return toBase64Url(encodeUtf8Base64(JSON.stringify(payload)));
  } catch {
    return null;
  }
};

export const decodeDesignPayload = (
  token: string
): PersistedDesignPayload | null => {
  if (!token) return null;

  try {
    const json = decodeUtf8Base64(fromBase64Url(token));
    const parsed = JSON.parse(json);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed as PersistedDesignPayload;
  } catch {
    return null;
  }
};
