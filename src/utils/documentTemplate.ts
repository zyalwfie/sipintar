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

export type DocumentAssetKind = 'header' | 'footer';

export type DefaultDocumentImage = {
  src: string;
  name: string;
  width: number;
  height: number;
};

export type DefaultDocumentImages = Record<
  DocumentAssetKind,
  DefaultDocumentImage
>;

// Gambar diambil dari header/footer sheet dokumen di sistem_excel.xlsx.
const defaultDocumentImagePaths: Record<DocumentAssetKind, string> = {
  header: '/header.png',
  footer: '/footer.jpg',
};

const emptyDefaultDocumentImage: DefaultDocumentImage = {
  src: '',
  name: '',
  width: 0,
  height: 0,
};

export const emptyDefaultDocumentImages: DefaultDocumentImages = {
  header: emptyDefaultDocumentImage,
  footer: emptyDefaultDocumentImage,
};

// Logo header di Excel berukuran 125.4pt x 43.2pt dan diletakkan di kanan (&R).
export const defaultHeaderAsset: Omit<DocumentTemplateAsset, 'src' | 'name'> =
  {
    position: 'right',
    height: 58,
    marginTop: 0,
    marginBottom: 2,
  };

const readBlobAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => resolve('');
    reader.readAsDataURL(blob);
  });

const loadDefaultDocumentImage = async (
  path: string
): Promise<DefaultDocumentImage> => {
  try {
    const response = await fetch(path);
    if (!response.ok) return emptyDefaultDocumentImage;

    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) return emptyDefaultDocumentImage;

    const src = await readBlobAsDataUrl(blob);
    if (!src) return emptyDefaultDocumentImage;

    return await new Promise<DefaultDocumentImage>((resolve) => {
      const image = new Image();

      image.onload = () =>
        resolve({
          src,
          name: path.split('/').pop() ?? '',
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      image.onerror = () => resolve(emptyDefaultDocumentImage);
      image.src = src;
    });
  } catch {
    return emptyDefaultDocumentImage;
  }
};

let defaultDocumentImagesPromise: Promise<DefaultDocumentImages> | null = null;

export const loadDefaultDocumentImages = () => {
  if (!defaultDocumentImagesPromise) {
    defaultDocumentImagesPromise = Promise.all([
      loadDefaultDocumentImage(defaultDocumentImagePaths.header),
      loadDefaultDocumentImage(defaultDocumentImagePaths.footer),
    ]).then(([header, footer]) => ({ header, footer }));
  }

  return defaultDocumentImagesPromise;
};

export type DocumentHeaderFooterVisibility = Record<DocumentAssetKind, boolean>;

const headerFooterVisibilityStorageKey =
  'sipintar-document-header-footer-visibility';

const getDocumentVisibilityKey = (paketId: string, documentIndex: string) =>
  `${paketId}:${documentIndex}`;

const readHeaderFooterVisibilityStore = (): Record<
  string,
  Partial<DocumentHeaderFooterVisibility>
> => {
  try {
    const stored = window.localStorage.getItem(
      headerFooterVisibilityStorageKey
    );
    const parsed = stored ? JSON.parse(stored) : {};

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
};

export const getDocumentHeaderFooterVisibility = (
  paketId: string,
  documentIndex: string
): DocumentHeaderFooterVisibility => {
  if (typeof window === 'undefined') return { header: true, footer: true };

  const stored =
    readHeaderFooterVisibilityStore()[
      getDocumentVisibilityKey(paketId, documentIndex)
    ];

  return {
    header: stored?.header !== false,
    footer: stored?.footer !== false,
  };
};

// Hanya setelan yang dimatikan yang disimpan.
export const saveDocumentHeaderFooterVisibility = (
  paketId: string,
  documentIndex: string,
  visibility: DocumentHeaderFooterVisibility
): boolean => {
  try {
    const store = readHeaderFooterVisibilityStore();
    const key = getDocumentVisibilityKey(paketId, documentIndex);
    const disabled: Partial<DocumentHeaderFooterVisibility> = {};

    if (!visibility.header) disabled.header = false;
    if (!visibility.footer) disabled.footer = false;

    if (Object.keys(disabled).length) {
      store[key] = disabled;
    } else {
      delete store[key];
    }

    window.localStorage.setItem(
      headerFooterVisibilityStorageKey,
      JSON.stringify(store)
    );

    return true;
  } catch {
    return false;
  }
};
