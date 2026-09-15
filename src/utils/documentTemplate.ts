export type DocumentAssetPosition = 'left' | 'center' | 'right' | 'stretch';

export type DocumentTemplateAsset = {
  src: string;
  name: string;
  position: DocumentAssetPosition;
  height: number;
  marginTop: number;
  marginBottom: number;
};

export type DocumentTemplateSettings = {
  header: DocumentTemplateAsset;
  footer: DocumentTemplateAsset;
  updatedAt: string;
};

export const documentAssetPositionOptions: {
  value: DocumentAssetPosition;
  label: string;
}[] = [
  { value: 'center', label: 'Tengah' },
  { value: 'left', label: 'Kiri' },
  { value: 'right', label: 'Kanan' },
  { value: 'stretch', label: 'Penuh halaman' },
];

const storageKey = 'sipintar-document-template-settings';

const defaultAsset: DocumentTemplateAsset = {
  src: '',
  name: '',
  position: 'center',
  height: 48,
  marginTop: 0,
  marginBottom: 8,
};

export const defaultDocumentTemplateSettings: DocumentTemplateSettings = {
  header: { ...defaultAsset, height: 48, marginBottom: 2 },
  footer: { ...defaultAsset, height: 46, marginTop: 24, marginBottom: 0 },
  updatedAt: '',
};

const normalizeNumber = (
  value: unknown,
  fallback: number,
  min: number,
  max: number
) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return fallback;

  return Math.min(Math.max(Math.round(numberValue), min), max);
};

const normalizePosition = (value: unknown): DocumentAssetPosition =>
  documentAssetPositionOptions.some((option) => option.value === value)
    ? (value as DocumentAssetPosition)
    : 'center';

const normalizeAsset = (
  asset: Partial<DocumentTemplateAsset> | undefined,
  fallback: DocumentTemplateAsset,
  kind: 'header' | 'footer'
): DocumentTemplateAsset => ({
  src: typeof asset?.src === 'string' ? asset.src : fallback.src,
  name: typeof asset?.name === 'string' ? asset.name : fallback.name,
  position: normalizePosition(asset?.position),
  height:
    kind === 'header'
      ? normalizeNumber(asset?.height, fallback.height, 24, 80)
      : normalizeNumber(asset?.height, fallback.height, 24, 180),
  marginTop: normalizeNumber(asset?.marginTop, fallback.marginTop, 0, 120),
  marginBottom:
    kind === 'header'
      ? normalizeNumber(asset?.marginBottom, fallback.marginBottom, 0, 12)
      : normalizeNumber(asset?.marginBottom, fallback.marginBottom, 0, 120),
});

export const getDocumentTemplateSettings = (): DocumentTemplateSettings => {
  if (typeof window === 'undefined') return defaultDocumentTemplateSettings;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultDocumentTemplateSettings;

    const parsed = JSON.parse(stored) as Partial<DocumentTemplateSettings>;

    return {
      header: normalizeAsset(
        parsed.header,
        defaultDocumentTemplateSettings.header,
        'header'
      ),
      footer: normalizeAsset(
        parsed.footer,
        defaultDocumentTemplateSettings.footer,
        'footer'
      ),
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : defaultDocumentTemplateSettings.updatedAt,
    };
  } catch {
    return defaultDocumentTemplateSettings;
  }
};

export const saveDocumentTemplateSettings = (
  settings: DocumentTemplateSettings
): boolean => {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...settings,
        updatedAt: new Date().toISOString(),
      })
    );

    return true;
  } catch {
    return false;
  }
};
