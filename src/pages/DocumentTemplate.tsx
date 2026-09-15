import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  FiImage,
  FiRefreshCcw,
  FiTrash2,
  FiUpload,
} from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import {
  DocumentTemplateAsset,
  DocumentTemplateSettings,
  defaultDocumentTemplateSettings,
  documentAssetPositionOptions,
  getDocumentTemplateSettings,
  saveDocumentTemplateSettings,
} from '../utils/documentTemplate';

type AssetKind = 'header' | 'footer';

const maxImageFileSize = 1.5 * 1024 * 1024;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const DocumentTemplate = () => {
  const headerInputRef = useRef<HTMLInputElement | null>(null);
  const footerInputRef = useRef<HTMLInputElement | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);
  const [settings, setSettings] = useState<DocumentTemplateSettings>(() =>
    getDocumentTemplateSettings()
  );
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(
    () => () => {
      if (statusTimeoutRef.current) window.clearTimeout(statusTimeoutRef.current);
    },
    []
  );

  const showStatus = (message: string) => {
    setStatusMessage(message);

    if (statusTimeoutRef.current) window.clearTimeout(statusTimeoutRef.current);

    statusTimeoutRef.current = window.setTimeout(
      () => setStatusMessage(''),
      3500
    );
  };

  const persistSettings = (
    updater: (current: DocumentTemplateSettings) => DocumentTemplateSettings,
    message = 'Pengaturan template dokumen tersimpan.'
  ) => {
    const next = updater(settings);
    const isSaved = saveDocumentTemplateSettings(next);

    if (isSaved) {
      setSettings(next);
      showStatus(message);
      return;
    }

    showStatus('Gagal menyimpan gambar. Coba gunakan file yang lebih kecil.');
  };

  const updateAsset = <K extends keyof DocumentTemplateAsset>(
    kind: AssetKind,
    key: K,
    value: DocumentTemplateAsset[K]
  ) => {
    persistSettings((current) => ({
      ...current,
      [kind]: {
        ...current[kind],
        [key]: value,
      },
    }));
  };

  const handleUpload = async (
    kind: AssetKind,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showStatus('File harus berupa gambar.');
      event.target.value = '';
      return;
    }

    if (file.size > maxImageFileSize) {
      showStatus('Ukuran gambar maksimal 1.5 MB agar bisa disimpan di browser.');
      event.target.value = '';
      return;
    }

    const src = await readFileAsDataUrl(file);

    persistSettings(
      (current) => ({
        ...current,
        [kind]: {
          ...current[kind],
          src,
          name: file.name,
        },
      }),
      `${kind === 'header' ? 'Header' : 'Footer'} berhasil diupload.`
    );
    event.target.value = '';
  };

  const removeAsset = (kind: AssetKind) => {
    persistSettings(
      (current) => ({
        ...current,
        [kind]: {
          ...current[kind],
          src: '',
          name: '',
        },
      }),
      `${kind === 'header' ? 'Header' : 'Footer'} dihapus dari template.`
    );
  };

  const resetSettings = () => {
    persistSettings(
      () => defaultDocumentTemplateSettings,
      'Pengaturan template dikembalikan ke default.'
    );
  };

  const renderAssetPanel = (
    kind: AssetKind,
    title: string,
    description: string,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    const asset = settings[kind];
    const maxHeight = kind === 'header' ? 80 : 180;

    return (
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded bg-primary/10 text-primary">
              <FiImage size={22} />
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => handleUpload(kind, event)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded border border-stroke px-4 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
            >
              <FiUpload size={17} />
              Upload
            </button>
            <button
              type="button"
              onClick={() => removeAsset(kind)}
              disabled={!asset.src}
              className="inline-flex h-10 items-center justify-center gap-2 rounded border border-stroke px-4 text-sm font-medium text-black transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:text-white"
            >
              <FiTrash2 size={17} />
              Hapus
            </button>
          </div>
        </div>

        <div className="mt-5 rounded border border-dashed border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
          {asset.src ? (
            <div
              className={`flex min-h-[130px] w-full items-center ${
                asset.position === 'left'
                  ? 'justify-start'
                  : asset.position === 'right'
                  ? 'justify-end'
                  : 'justify-center'
              }`}
            >
              <img
                src={asset.src}
                alt={`${title} dokumen`}
                className="max-w-full object-contain"
                style={{
                  height: `${asset.height}px`,
                  width: asset.position === 'stretch' ? '100%' : 'auto',
                }}
              />
            </div>
          ) : (
            <div className="flex min-h-[130px] items-center justify-center text-center">
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  Belum ada gambar
                </p>
                <p className="mt-1 text-xs text-body dark:text-bodydark">
                  Upload PNG, JPG, atau WEBP.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Posisi Default
            </label>
            <select
              value={asset.position}
              onChange={(event) =>
                updateAsset(
                  kind,
                  'position',
                  event.target.value as DocumentTemplateAsset['position']
                )
              }
              className="w-full rounded border border-stroke bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            >
              {documentAssetPositionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Tinggi Gambar
            </label>
            <input
              type="number"
              min={24}
              max={maxHeight}
              value={asset.height}
              onChange={(event) =>
                updateAsset(kind, 'height', Number(event.target.value))
              }
              className="w-full rounded border border-stroke bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Jarak Atas
            </label>
            <input
              type="number"
              min={0}
              max={120}
              value={asset.marginTop}
              onChange={(event) =>
                updateAsset(kind, 'marginTop', Number(event.target.value))
              }
              className="w-full rounded border border-stroke bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Jarak Bawah
            </label>
            <input
              type="number"
              min={0}
              max={120}
              value={asset.marginBottom}
              onChange={(event) =>
                updateAsset(kind, 'marginBottom', Number(event.target.value))
              }
              className="w-full rounded border border-stroke bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>
        </div>

        {asset.name && (
          <p className="mt-3 text-xs font-medium text-body dark:text-bodydark">
            File: {asset.name}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb pageName="Template Dokumen" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Glossary Template Dokumen
          </h2>
          <p className="mt-1 text-sm text-body dark:text-bodydark">
            Upload gambar header dan footer untuk dipakai pada hasil dokumen.
          </p>
        </div>
        <button
          type="button"
          onClick={resetSettings}
          className="inline-flex h-10 items-center justify-center gap-2 rounded border border-stroke px-4 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
        >
          <FiRefreshCcw size={17} />
          Reset Default
        </button>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-sm border border-primary/30 bg-primary/10 px-5 py-4 text-sm font-semibold text-primary">
          {statusMessage}
        </div>
      )}

      <div className="space-y-6">
        {renderAssetPanel(
          'header',
          'Gambar Header',
          'Gambar ini akan muncul di bagian atas halaman hasil dokumen.',
          headerInputRef
        )}
        {renderAssetPanel(
          'footer',
          'Gambar Footer',
          'Gambar ini akan muncul di bagian bawah konten hasil dokumen.',
          footerInputRef
        )}
      </div>
    </>
  );
};

export default DocumentTemplate;
