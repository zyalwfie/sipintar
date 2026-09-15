import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiDownload,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiUserCheck,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

type JenisKelamin = 'L' | 'P';

type Pegawai = {
  id: number;
  kodePegawai: string;
  kodeUnit: string;
  unitKerja: string;
  nama: string;
  jabatan: string;
  nrp: string;
  jenisKelamin: JenisKelamin;
};

type ModalMode = 'add' | 'edit' | 'delete';

const excelHeaders = [
  'Kode Pegawai',
  'Kode Unit',
  'Unit Kerja',
  'Nama',
  'Jabatan',
  'NRP',
  'Jenis Kelamin',
];

const initialPegawai: Pegawai[] = [
  {
    id: 1,
    kodePegawai: 'PGW-001',
    kodeUnit: 'PBJ',
    unitKerja: 'Pengadaan Internal',
    nama: 'I Made Surya Pratama',
    jabatan: 'Pejabat Pembuat Komitmen',
    nrp: '19870412',
    jenisKelamin: 'L',
  },
  {
    id: 2,
    kodePegawai: 'PGW-002',
    kodeUnit: 'OPR',
    unitKerja: 'Operasional',
    nama: 'Ni Putu Maharani',
    jabatan: 'Pejabat Pengadaan Barang/Jasa',
    nrp: '19910622',
    jenisKelamin: 'P',
  },
  {
    id: 3,
    kodePegawai: 'PGW-003',
    kodeUnit: 'UMM',
    unitKerja: 'Umum',
    nama: 'Muhammad Rizal Fahri',
    jabatan: 'Analis Pengadaan',
    nrp: '19891105',
    jenisKelamin: 'L',
  },
  {
    id: 4,
    kodePegawai: 'PGW-004',
    kodeUnit: 'ADM',
    unitKerja: 'Administrasi',
    nama: 'Ayu Lestari Dewi',
    jabatan: 'Kepala Bagian Umum',
    nrp: '19940718',
    jenisKelamin: 'P',
  },
];

const emptyForm = {
  kodePegawai: '',
  kodeUnit: '',
  unitKerja: '',
  nama: '',
  jabatan: '',
  nrp: '',
  jenisKelamin: 'L' as JenisKelamin,
};

const getCellValue = (row: Record<string, unknown>, header: string) => {
  const foundKey = Object.keys(row).find(
    (key) => key.trim().toLowerCase() === header.toLowerCase()
  );
  const value = foundKey ? row[foundKey] : '';

  return String(value ?? '').trim();
};

const normalizeJenisKelamin = (value: string): JenisKelamin => {
  const code = value.trim().toUpperCase();
  return code === 'P' || code.includes('PEREMPUAN') ? 'P' : 'L';
};

const labelJenisKelamin = (value: JenisKelamin) =>
  value === 'L' ? 'Laki-laki' : 'Perempuan';

const DataPegawai = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pegawai, setPegawai] = useState<Pegawai[]>(initialPegawai);
  const [query, setQuery] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    if (!modalMode) return;

    const animationFrame = requestAnimationFrame(() => {
      setIsModalVisible(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [modalMode]);

  const filteredPegawai = useMemo(() => {
    const keyword = query.toLowerCase();

    return pegawai.filter((item) =>
      `${item.kodePegawai} ${item.kodeUnit} ${item.unitKerja} ${item.nama} ${item.jabatan} ${item.nrp} ${item.jenisKelamin} ${labelJenisKelamin(item.jenisKelamin)}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [pegawai, query]);

  const totalLakiLaki = pegawai.filter((item) => item.jenisKelamin === 'L').length;
  const totalPerempuan = pegawai.filter((item) => item.jenisKelamin === 'P').length;
  const units = new Set(pegawai.map((item) => item.unitKerja)).size;

  const openModal = (mode: ModalMode, item?: Pegawai) => {
    setModalMode(mode);
    setSelectedPegawai(item ?? null);
    setIsModalVisible(false);
    setForm(
      item
        ? {
            kodePegawai: item.kodePegawai,
            kodeUnit: item.kodeUnit,
            unitKerja: item.unitKerja,
            nama: item.nama,
            jabatan: item.jabatan,
            nrp: item.nrp,
            jenisKelamin: item.jenisKelamin,
          }
        : emptyForm
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    window.setTimeout(() => {
      setModalMode(null);
      setSelectedPegawai(null);
    }, 200);
  };

  const updateForm = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (modalMode === 'add') {
      setPegawai((current) => [
        ...current,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    if (modalMode === 'edit' && selectedPegawai) {
      setPegawai((current) =>
        current.map((item) =>
          item.id === selectedPegawai.id
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!selectedPegawai) return;

    setPegawai((current) =>
      current.filter((item) => item.id !== selectedPegawai.id)
    );
    closeModal();
  };

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        'Kode Pegawai': 'PGW-005',
        'Kode Unit': 'PBJ',
        'Unit Kerja': 'Pengadaan Internal',
        Nama: 'Nama Pegawai',
        Jabatan: 'Jabatan Pegawai',
        NRP: '12345678',
        'Jenis Kelamin': 'L',
      },
    ]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pegawai');
    XLSX.writeFile(workbook, 'template-data-pegawai-sipintar.xlsx');
  };

  const handleImportExcel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: '',
    });

    const importedPegawai = rows
      .map((row, index) => ({
        id: Date.now() + index,
        kodePegawai: getCellValue(row, 'Kode Pegawai'),
        kodeUnit: getCellValue(row, 'Kode Unit'),
        unitKerja: getCellValue(row, 'Unit Kerja'),
        nama: getCellValue(row, 'Nama'),
        jabatan: getCellValue(row, 'Jabatan'),
        nrp: getCellValue(row, 'NRP'),
        jenisKelamin: normalizeJenisKelamin(getCellValue(row, 'Jenis Kelamin')),
      }))
      .filter(
        (item) =>
          item.kodePegawai &&
          item.kodeUnit &&
          item.unitKerja &&
          item.nama &&
          item.jabatan &&
          item.nrp
      );

    if (importedPegawai.length > 0) {
      setPegawai((current) => [...current, ...importedPegawai]);
      setImportMessage(`${importedPegawai.length} data pegawai berhasil diimport.`);
    } else {
      setImportMessage(
        'Import gagal. Pastikan header Excel sesuai template yang tersedia.'
      );
    }

    event.target.value = '';
    window.setTimeout(() => setImportMessage(''), 3500);
  };

  return (
    <>
      <Breadcrumb pageName="Data Pegawai" />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
            <FiUsers size={20} />
          </div>
          <p className="text-sm font-medium">Total Pegawai</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {pegawai.length}
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-success/10 text-success">
            <FiUserCheck size={20} />
          </div>
          <p className="text-sm font-medium">Laki-laki</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {totalLakiLaki}
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-warning/10 text-warning">
            <FiUserCheck size={20} />
          </div>
          <p className="text-sm font-medium">Perempuan</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {totalPerempuan}
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-meta-5/10 text-meta-5">
            <FiUsers size={20} />
          </div>
          <p className="text-sm font-medium">Unit Terdata</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {units}
          </h3>
        </div>
      </div>

      {importMessage && (
        <div className="mb-6 rounded-sm border border-primary/30 bg-primary/10 px-5 py-4 text-sm font-semibold text-primary">
          {importMessage}
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-7.5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Glossary Data Pegawai
            </h4>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              Master pegawai untuk kebutuhan PPK, PBJ, dan tanda tangan dokumen.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
            <div className="flex h-11 min-w-[260px] items-center gap-2 rounded border border-stroke bg-white px-4 dark:border-form-strokedark dark:bg-form-input">
              <FiSearch size={17} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari kode, nama, NRP"
                className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded border border-stroke px-4 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
            >
              <FiUpload size={18} />
              Import Data Excel
            </button>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded border border-stroke px-4 text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-strokedark dark:text-white"
            >
              <FiDownload size={18} />
              Download Template
            </button>
            <button
              type="button"
              onClick={() => openModal('add')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded bg-primary px-4 text-sm font-medium text-white transition hover:bg-opacity-90"
            >
              <FiPlus size={18} />
              Tambah Pegawai
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {excelHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-5 py-4 text-sm font-medium uppercase text-black dark:text-white"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-5 py-4 text-center text-sm font-medium uppercase text-black dark:text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPegawai.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-stroke last:border-b-0 dark:border-strokedark"
                >
                  <td className="px-5 py-4 text-sm font-medium text-black dark:text-white">
                    {item.kodePegawai}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {item.kodeUnit}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {item.unitKerja}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-black dark:text-white">
                    {item.nama}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {item.jabatan}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {item.nrp}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        item.jenisKelamin === 'L'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-meta-5/10 text-meta-5'
                      }`}
                    >
                      {item.jenisKelamin} - {labelJenisKelamin(item.jenisKelamin)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openModal('edit', item)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-primary/10 hover:text-primary dark:text-bodydark"
                        title="Edit"
                        aria-label="Edit pegawai"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal('delete', item)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-danger/10 hover:text-danger dark:text-bodydark"
                        title="Hapus"
                        aria-label="Hapus pegawai"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPegawai.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-body dark:text-bodydark"
                  >
                    Data pegawai tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode && (
        <div
          className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm transition-opacity duration-200 ${
            isModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeModal}
        >
          <div
            className={`w-full max-h-[88vh] max-w-[620px] overflow-y-auto rounded-sm border border-stroke bg-white shadow-default transition-all duration-200 dark:border-strokedark dark:bg-boxdark ${
              isModalVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-95 opacity-0'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
              <h3 className="text-base font-semibold text-black dark:text-white">
                {modalMode === 'add' && 'Tambah Pegawai'}
                {modalMode === 'edit' && 'Edit Pegawai'}
                {modalMode === 'delete' && 'Hapus Pegawai'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-body transition hover:bg-gray-2 hover:text-black dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white"
                aria-label="Tutup modal"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              {modalMode === 'delete' && selectedPegawai ? (
                <>
                  <p className="text-sm text-body dark:text-bodydark">
                    Yakin ingin menghapus pegawai ini dari glossary?
                  </p>
                  <div className="mt-4 rounded bg-gray-2 p-4 dark:bg-meta-4">
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {selectedPegawai.nama}
                    </p>
                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                      {selectedPegawai.kodePegawai} | NRP : {selectedPegawai.nrp}
                    </p>
                  </div>
                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 rounded bg-danger px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
                    >
                      <FiTrash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Kode Pegawai
                      </label>
                      <input
                        type="text"
                        required
                        value={form.kodePegawai}
                        onChange={(event) =>
                          updateForm('kodePegawai', event.target.value)
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Kode Unit
                      </label>
                      <input
                        type="text"
                        required
                        value={form.kodeUnit}
                        onChange={(event) =>
                          updateForm('kodeUnit', event.target.value)
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Unit Kerja
                      </label>
                      <input
                        type="text"
                        required
                        value={form.unitKerja}
                        onChange={(event) =>
                          updateForm('unitKerja', event.target.value)
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Nama
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nama}
                        onChange={(event) => updateForm('nama', event.target.value)}
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        required
                        value={form.jabatan}
                        onChange={(event) =>
                          updateForm('jabatan', event.target.value)
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        NRP
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nrp}
                        onChange={(event) => updateForm('nrp', event.target.value)}
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Jenis Kelamin
                      </label>
                      <select
                        value={form.jenisKelamin}
                        onChange={(event) =>
                          updateForm(
                            'jenisKelamin',
                            event.target.value as JenisKelamin
                          )
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      >
                        <option value="L">L - Laki-laki</option>
                        <option value="P">P - Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded border border-stroke px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90"
                    >
                      <FiUserCheck size={16} />
                      Simpan
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataPegawai;
