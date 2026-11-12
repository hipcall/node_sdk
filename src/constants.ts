/** Hipcall sunucu bölgesi: global = use.hipcall.com, tr = use.hipcall.com.tr */
export type HipcallRegion = "global" | "tr";

export const HIPCALL_BASE_ADDRESSES: Record<HipcallRegion, string> = {
  global: "https://use.hipcall.com",
  tr: "https://use.hipcall.com.tr",
};

export const DEFAULT_HIPCALL_REGION: HipcallRegion = "global";

export const DEFAULT_HIPCALL_BASE_ADDRESS = HIPCALL_BASE_ADDRESSES[DEFAULT_HIPCALL_REGION];

/** baseUrl verilmişse onu, yoksa bölgenin adresini döner. */
export function resolveBaseAddress(baseUrl?: string | null, region?: HipcallRegion): string {
  if (baseUrl) return baseUrl.replace(/\/+$/, "");
  const r = region ?? DEFAULT_HIPCALL_REGION;
  const address = HIPCALL_BASE_ADDRESSES[r];
  if (!address) {
    throw new Error(`Invalid region: "${r}". Use "global" or "tr".`);
  }
  return address;
}
