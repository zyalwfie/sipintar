import { ReactNode, useEffect, useState } from 'react';
import {
  FiEdit2,
  FiExternalLink,
  FiEye,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

type Pengadaan = {
  id: number;
  namaPenyedia: string;
  judulPengadaan: string;
  hps: number;
  status: 'Lengkap' | 'Belum Lengkap';
  createdAt: string;
};

type ModalMode = 'view' | 'delete';

const initialPengadaanData: Pengadaan[] = [
  {
    id: 1,
    namaPenyedia: 'PT Nusa Teknologi Mandiri',
    judulPengadaan: 'Pengadaan Laptop Operasional Kantor',
    hps: 185000000,
    status: 'Lengkap',
    createdAt: '2026-07-30T09:15:00+08:00',
  },
  {
    id: 2,
    namaPenyedia: 'CV Sinar Berkah Abadi',
    judulPengadaan: 'Pengadaan Meja dan Kursi Ruang Rapat',
    hps: 72500000,
    status: 'Belum Lengkap',
    createdAt: '2026-08-03T10:30:00+08:00',
  },
  {
    id: 3,
    namaPenyedia: 'PT Prima Solusi Digital',
    judulPengadaan: 'Pengadaan Lisensi Software Akuntansi',
    hps: 128750000,
    status: 'Lengkap',
    createdAt: '2026-08-11T14:05:00+08:00',
  },
  {
    id: 4,
    namaPenyedia: 'CV Karya Logistik Nusantara',
    judulPengadaan: 'Pengadaan Kendaraan Operasional Cabang',
    hps: 342000000,
    status: 'Belum Lengkap',
    createdAt: '2026-09-02T08:45:00+08:00',
  },
  {
    id: 5,
    namaPenyedia: 'PT Citra Sarana Sejahtera',
    judulPengadaan: 'Pengadaan Perangkat Jaringan Internal',
    hps: 96500000,
    status: 'Lengkap',
    createdAt: '2026-09-14T11:20:00+08:00',
  },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

const statusClassName = (status: Pengadaan['status']) =>
  status === 'Lengkap'
    ? 'bg-success/10 text-success'
    : 'bg-warning/10 text-warning';

const terbilangRingkas = (value: number) =>
  `${new Intl.NumberFormat('id-ID').format(value)} rupiah`;

const formatTanggalIndonesia = () =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

const formatTanggalDibuat = (timestamp: string) =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestamp));

const formatFilterLabel = (monthValue: string) => {
  const [year, month] = monthValue.split('-');

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Number(year), Number(month) - 1, 1));
};

const getMonthValue = (timestamp: string) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${date.getFullYear()}-${month}`;
};

const getNomorDokumen = (index: number) => {
  const now = new Date();
  const nomorUrut = String(index + 1).padStart(3, '0');
  const bulan = String(now.getMonth() + 1).padStart(2, '0');
  return `${nomorUrut}.${bulan}.PBJ./BPR-NTB/2026`;
};

const dokumenPelaksana = [
  'Surat Undangan Pengadaan',
  'Berita Acara Penjelasan Pekerjaan',
  'Bukti Pengambilan Dokumen Pengadaan',
  'Berita Acara Pemasukan dan Pembukaan Dokumen',
  'Tanda Terima Pemasukan Dokumen',
  'Berita Acara Evaluasi Dokumen',
  'Undangan Klarifikasi dan Negosiasi',
  'Berita Acara Klarifikasi dan Negosiasi Dokumen',
  'Berita Acara Hasil Pengadaan Langsung',
  'Penunjukan Penyedia Pengadaan',
  'SPK atau Kontrak Kerja',
  'SPMK',
  'Berita Acara Pemeriksaan Pekerjaan',
  'Berita Acara Serah Terima Pekerjaan',
  'Pengajuan Pembayaran',
];

const getPengadaanDetail = (pengadaan: Pengadaan) => ({
  dataPenyedia: [
    ['Alamat', 'Jl. Langko No. 12, Mataram'],
    ['Nama Direktur', 'I Gede Wirawan'],
    ['Nomor Identitas/NIP/NRP', `ID-${pengadaan.id}9821`],
    ['Telepon/Fax', '0370-625412'],
    ['Email', `admin.${pengadaan.id}@vendor.co.id`],
    ['Jabatan', 'Direktur'],
    ['Harga Penawaran Sudah Pajak 11%', formatRupiah(pengadaan.hps - 7500000)],
    ['NPWP', `01.234.${pengadaan.id}56.7-911.000`],
  ],
  nilai: [
    ['Judul Pengadaan', pengadaan.judulPengadaan],
    ['Perhitungan HPS', formatRupiah(pengadaan.hps)],
    ['Terbilang HPS', terbilangRingkas(pengadaan.hps)],
    ['Harga yang Ditawarkan Vendor', formatRupiah(pengadaan.hps - 7500000)],
    ['Hasil Negosiasi', formatRupiah(pengadaan.hps - 12500000)],
    ['Tempat Penandatanganan', 'Mataram'],
    ['Peserta', 'PPK, PBJ, Penyedia, dan Tim Teknis'],
  ],
  ppk: [
    ['I Made Surya Pratama', '19870412'],
    ['Ayu Lestari Dewi', '19940718'],
  ],
  pbj: [
    ['Ni Putu Maharani', '19910622'],
    ['Muhammad Rizal Fahri', '19891105'],
  ],
  penandaTangan: ['I Made Surya Pratama', 'Ni Putu Maharani'],
});

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded bg-gray-2 px-4 py-3 dark:bg-meta-4">
    <p className="mb-1 text-xs font-medium uppercase text-body dark:text-bodydark">
      {label}
    </p>
    <p className="text-sm font-semibold text-black dark:text-white">{value}</p>
  </div>
);

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h4 className="mb-3 text-sm font-semibold uppercase text-black dark:text-white">
      {title}
    </h4>
    {children}
  </div>
);

const TableOne = () => {
  const [pengadaanData, setPengadaanData] =
    useState<Pengadaan[]>(initialPengadaanData);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [selectedPengadaan, setSelectedPengadaan] = useState<Pengadaan | null>(
    null
  );
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!modalMode) return;

    const animationFrame = requestAnimationFrame(() => {
      setIsModalVisible(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [modalMode]);

  const openModal = (mode: ModalMode, pengadaan: Pengadaan) => {
    setSelectedPengadaan(pengadaan);
    setModalMode(mode);
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    window.setTimeout(() => {
      setModalMode(null);
      setSelectedPengadaan(null);
    }, 200);
  };

  const handleDelete = () => {
    if (!selectedPengadaan) return;

    setPengadaanData((currentData) =>
      currentData.filter((pengadaan) => pengadaan.id !== selectedPengadaan.id)
    );
    closeModal();
  };

  const monthOptions = Array.from(
    new Set(pengadaanData.map((pengadaan) => getMonthValue(pengadaan.createdAt)))
  ).sort((first, second) => second.localeCompare(first));

  const filteredPengadaanData = pengadaanData.filter((pengadaan) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchableText = [
      pengadaan.namaPenyedia,
      pengadaan.judulPengadaan,
      pengadaan.status,
      formatRupiah(pengadaan.hps),
      formatTanggalDibuat(pengadaan.createdAt),
    ]
      .join(' ')
      .toLowerCase();
    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);
    const matchesMonth =
      !monthFilter || getMonthValue(pengadaan.createdAt) === monthFilter;

    return matchesSearch && matchesMonth;
  });

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              PENGADAAN
            </h4>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              Daftar proses pengadaan internal BPR NTB.
            </p>
          </div>

          <Link
            to="/pengadaan/tambah"
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90"
          >
            <FiPlus size={18} />
            Pengadaan
          </Link>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari nama penyedia, judul, status, HPS, atau tanggal..."
              className="w-full rounded border border-stroke bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
            />
          </div>

          <select
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            className="w-full rounded border border-stroke bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
            aria-label="Filter bulan dan tahun pengadaan"
          >
            <option value="">Semua Bulan & Tahun</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatFilterLabel(month)}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-body dark:text-bodydark">
          Menampilkan {filteredPengadaanData.length} dari {pengadaanData.length}{' '}
          pengadaan
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Nama Penyedia
                </th>
                <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Judul Pengadaan
                </th>
                <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Perhitungan HPS
                </th>
                <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Tanggal Dibuat
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium uppercase text-black dark:text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPengadaanData.map((pengadaan, index) => (
                <tr
                  className={
                    index === filteredPengadaanData.length - 1
                      ? ''
                      : 'border-b border-stroke dark:border-strokedark'
                  }
                  key={pengadaan.id}
                >
                  <td className="px-4 py-5 text-sm text-black dark:text-white">
                    {pengadaan.namaPenyedia}
                  </td>
                  <td className="px-4 py-5 text-sm text-black dark:text-white">
                    {pengadaan.judulPengadaan}
                  </td>
                  <td className="px-4 py-5 text-sm font-medium text-black dark:text-white">
                    {formatRupiah(pengadaan.hps)}
                  </td>
                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClassName(
                        pengadaan.status
                      )}`}
                    >
                      {pengadaan.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm text-black dark:text-white">
                    {formatTanggalDibuat(pengadaan.createdAt)}
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openModal('view', pengadaan)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-primary/10 hover:text-primary dark:text-bodydark"
                        aria-label="Lihat pengadaan"
                        title="Lihat"
                      >
                        <FiEye size={18} />
                      </button>
                      <Link
                        to={`/pengadaan/edit/${pengadaan.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-primary/10 hover:text-primary dark:text-bodydark"
                        aria-label="Edit pengadaan"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openModal('delete', pengadaan)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-danger/10 hover:text-danger dark:text-bodydark"
                        aria-label="Hapus pengadaan"
                        title="Hapus"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPengadaanData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-body dark:text-bodydark"
                  >
                    Data pengadaan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPengadaan && modalMode && (
        <div
          className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm transition-opacity duration-200 ${
            isModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeModal}
        >
          <div
            className={`w-full max-h-[85vh] overflow-y-auto rounded-sm border border-stroke bg-white shadow-default transition-all duration-200 dark:border-strokedark dark:bg-boxdark ${
              isModalVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-95 opacity-0'
            }`}
            style={{ maxWidth: modalMode === 'view' ? 920 : 440 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stroke px-5 py-4 dark:border-strokedark">
              <div>
                <h3 className="text-base font-semibold text-black dark:text-white">
                  {modalMode === 'view' && 'Detail Pengadaan'}
                  {modalMode === 'delete' && 'Hapus Pengadaan'}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-body dark:text-bodydark">
                  {selectedPengadaan.judulPengadaan}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-body transition hover:bg-gray-2 hover:text-black dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white"
                aria-label="Tutup modal"
                title="Tutup"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              {modalMode === 'view' && (
                <div className="space-y-6">
                  {(() => {
                    const detail = getPengadaanDetail(selectedPengadaan);
                    const tanggal = formatTanggalIndonesia();

                    return (
                      <>
                        <DetailSection title="1. Nama Penyedia">
                          <DetailItem
                            label="Nama Penyedia"
                            value={selectedPengadaan.namaPenyedia}
                          />
                        </DetailSection>

                        <DetailSection title="2. Data Penyedia">
                          <div className="grid gap-3 md:grid-cols-2">
                            {detail.dataPenyedia.map(([label, value]) => (
                              <DetailItem key={label} label={label} value={value} />
                            ))}
                          </div>
                        </DetailSection>

                        <DetailSection title="3. Keterangan Pelaksana">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] table-auto">
                              <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                  <th className="px-4 py-3 text-xs font-medium uppercase text-black dark:text-white">
                                    Dokumen
                                  </th>
                                  <th className="px-4 py-3 text-xs font-medium uppercase text-black dark:text-white">
                                    Tanggal Pelaksana
                                  </th>
                                  <th className="px-4 py-3 text-xs font-medium uppercase text-black dark:text-white">
                                    Nomor Dokumen
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-black dark:text-white">
                                    Buka Dokumen
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {dokumenPelaksana.map((dokumen, index) => (
                                  <tr
                                    key={dokumen}
                                    className="border-b border-stroke last:border-b-0 dark:border-strokedark"
                                  >
                                    <td className="px-4 py-3 text-sm text-black dark:text-white">
                                      {dokumen}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-black dark:text-white">
                                      {tanggal}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-black dark:text-white">
                                      {getNomorDokumen(index)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex justify-center">
                                        <Link
                                          to={`/pengadaan/${selectedPengadaan.id}/dokumen/${
                                            index + 1
                                          }/buka`}
                                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-primary/10 hover:text-primary dark:text-bodydark"
                                          aria-label={`Buka dokumen ${dokumen}`}
                                          title="Buka Dokumen"
                                        >
                                          <FiExternalLink size={17} />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </DetailSection>

                        <DetailSection title="4. Detail Pengadaan">
                          <div className="grid gap-3 md:grid-cols-2">
                            {detail.nilai.map(([label, value]) => (
                              <DetailItem key={label} label={label} value={value} />
                            ))}
                            <DetailItem
                              label="Tanggal Dibuat"
                              value={formatTanggalDibuat(
                                selectedPengadaan.createdAt
                              )}
                            />
                            <div className="rounded bg-gray-2 px-4 py-3 dark:bg-meta-4">
                              <p className="mb-2 text-xs font-medium uppercase text-body dark:text-bodydark">
                                Status
                              </p>
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClassName(
                                  selectedPengadaan.status
                                )}`}
                              >
                                {selectedPengadaan.status}
                              </span>
                            </div>
                          </div>
                        </DetailSection>

                        <div className="grid gap-5 md:grid-cols-2">
                          <DetailSection title="5. Nama PPK">
                            <div className="space-y-2">
                              {detail.ppk.map(([nama, nrp]) => (
                                <DetailItem
                                  key={nrp}
                                  label={nama}
                                  value={`NRP : ${nrp}`}
                                />
                              ))}
                            </div>
                          </DetailSection>

                          <DetailSection title="6. Nama PBJ">
                            <div className="space-y-2">
                              {detail.pbj.map(([nama, nrp]) => (
                                <DetailItem
                                  key={nrp}
                                  label={nama}
                                  value={`NRP : ${nrp}`}
                                />
                              ))}
                            </div>
                          </DetailSection>
                        </div>

                        <DetailSection title="7. Master Data Tanda Tangan">
                          <div className="grid gap-3 md:grid-cols-2">
                            {detail.penandaTangan.map((nama, index) => (
                              <DetailItem
                                key={nama}
                                label={`Nama Penanda Tangan ${index + 1}`}
                                value={nama}
                              />
                            ))}
                          </div>
                        </DetailSection>
                      </>
                    );
                  })()}
                </div>
              )}

              {modalMode === 'delete' && (
                <div>
                  <p className="text-sm text-body dark:text-bodydark">
                    Yakin ingin menghapus data pengadaan ini?
                  </p>
                  <div className="mt-4 rounded bg-gray-2 p-4 dark:bg-meta-4">
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {selectedPengadaan.namaPenyedia}
                    </p>
                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                      {selectedPengadaan.judulPengadaan}
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableOne;
