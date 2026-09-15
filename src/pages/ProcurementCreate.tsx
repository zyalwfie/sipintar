import { FormEvent, useMemo, useState } from 'react';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronDown,
  FiFileText,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

type Pegawai = {
  id: string;
  nama: string;
  nrp: string;
  jabatan: string;
};

type DokumenPelaksana = {
  nama: string;
  wajib: boolean;
};

const pegawaiOptions: Pegawai[] = [
  {
    id: 'p-1',
    nama: 'I Made Surya Pratama',
    nrp: '19870412',
    jabatan: 'Pejabat Pembuat Komitmen',
  },
  {
    id: 'p-2',
    nama: 'Ni Putu Maharani',
    nrp: '19910622',
    jabatan: 'Pejabat Pengadaan Barang/Jasa',
  },
  {
    id: 'p-3',
    nama: 'Muhammad Rizal Fahri',
    nrp: '19891105',
    jabatan: 'Analis Pengadaan',
  },
  {
    id: 'p-4',
    nama: 'Ayu Lestari Dewi',
    nrp: '19940718',
    jabatan: 'Kepala Bagian Umum',
  },
  {
    id: 'p-5',
    nama: 'Gede Arya Wiratama',
    nrp: '19850330',
    jabatan: 'Verifikator Pengadaan',
  },
  {
    id: 'p-6',
    nama: 'Siti Rahmawati',
    nrp: '19920914',
    jabatan: 'Administrasi Pengadaan',
  },
];

const dokumenPelaksana: DokumenPelaksana[] = [
  { nama: 'Kerangka Acuan Kerja', wajib: false },
  { nama: 'Surat Undangan Pengadaan', wajib: true },
  { nama: 'Berita Acara Penjelasan Pekerjaan', wajib: true },
  { nama: 'Bukti Pengambilan Dokumen Pengadaan', wajib: true },
  { nama: 'Berita Acara Pemasukan dan Pembukaan Dokumen', wajib: true },
  { nama: 'Tanda Terima Pemasukan Dokumen', wajib: true },
  { nama: 'Berita Acara Evaluasi Dokumen', wajib: true },
  { nama: 'Undangan Klarifikasi dan Negosiasi', wajib: true },
  { nama: 'Berita Acara Klarifikasi dan Negosiasi Dokumen', wajib: true },
  { nama: 'Berita Acara Hasil Pengadaan Langsung', wajib: true },
  { nama: 'Penunjukan Penyedia Pengadaan', wajib: true },
  { nama: 'SPK atau Kontrak Kerja', wajib: true },
  { nama: 'SPMK', wajib: true },
  { nama: 'Berita Acara Pemeriksaan Pekerjaan', wajib: true },
  { nama: 'Berita Acara Serah Terima Pekerjaan', wajib: true },
  { nama: 'Pengajuan Pembayaran', wajib: true },
];

const penyediaInitial = {
  alamat: '',
  namaDirektur: '',
  nomorIdentitas: '',
  teleponFax: '',
  email: '',
  jabatan: '',
  hargaPenawaranPajak: '',
  npwp: '',
};

const detailInitial = {
  judulPengadaan: '',
  perhitunganHps: '',
  hargaVendor: '',
  hasilNegosiasi: '',
  tempatPenandatanganan: '',
  peserta: '',
};

const editPengadaanSeeds = [
  {
    id: 1,
    namaPenyedia: 'PT Nusa Teknologi Mandiri',
    judulPengadaan: 'Pengadaan Laptop Operasional Kantor',
    hps: '185000000',
  },
  {
    id: 2,
    namaPenyedia: 'CV Sinar Berkah Abadi',
    judulPengadaan: 'Pengadaan Meja dan Kursi Ruang Rapat',
    hps: '72500000',
  },
  {
    id: 3,
    namaPenyedia: 'PT Prima Solusi Digital',
    judulPengadaan: 'Pengadaan Lisensi Software Akuntansi',
    hps: '128750000',
  },
  {
    id: 4,
    namaPenyedia: 'CV Karya Logistik Nusantara',
    judulPengadaan: 'Pengadaan Kendaraan Operasional Cabang',
    hps: '342000000',
  },
  {
    id: 5,
    namaPenyedia: 'PT Citra Sarana Sejahtera',
    judulPengadaan: 'Pengadaan Perangkat Jaringan Internal',
    hps: '96500000',
  },
];

const getEditSeed = (id?: string) => {
  const selectedId = Number(id);
  const selected =
    editPengadaanSeeds.find((pengadaan) => pengadaan.id === selectedId) ??
    editPengadaanSeeds[0];
  const hargaVendor = String(Number(selected.hps) - 7500000);
  const hasilNegosiasi = String(Number(selected.hps) - 12500000);

  return {
    namaPenyedia: selected.namaPenyedia,
    penyedia: {
      alamat: 'Jl. Langko No. 12, Mataram',
      namaDirektur: 'I Gede Wirawan',
      nomorIdentitas: `ID-${selected.id}9821`,
      teleponFax: '0370-625412',
      email: `admin.${selected.id}@vendor.co.id`,
      jabatan: 'Direktur',
      hargaPenawaranPajak: hargaVendor,
      npwp: `01.234.${selected.id}56.7-911.000`,
    },
    detail: {
      judulPengadaan: selected.judulPengadaan,
      perhitunganHps: selected.hps,
      hargaVendor,
      hasilNegosiasi,
      tempatPenandatanganan: 'Mataram',
      peserta: 'PPK, PBJ, Penyedia, dan Tim Teknis',
    },
    ppkIds: ['p-1', 'p-4'],
    pbjIds: ['p-2', 'p-3'],
    penandaTangan: ['I Made Surya Pratama', 'Ni Putu Maharani'],
  };
};

const formatRupiahText = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  return new Intl.NumberFormat('id-ID').format(Number(digits));
};

const formatTanggalIndonesia = () =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

const getNomorDokumen = (index: number) => {
  const now = new Date();
  const nomorUrut = String(index + 1).padStart(3, '0');
  const bulan = String(now.getMonth() + 1).padStart(2, '0');
  return `${nomorUrut}.${bulan}.PBJ./BPR-NTB/2026`;
};

const terbilang = (value: number): string => {
  const satuan = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
  ];

  if (!value) return 'Nol rupiah';
  if (value < 12) return `${satuan[value]} rupiah`;
  if (value < 20) return `${terbilang(value - 10).replace(' rupiah', '')} belas rupiah`;
  if (value < 100) {
    const puluh = Math.floor(value / 10);
    const sisa = value % 10;
    return `${satuan[puluh]} puluh${sisa ? ` ${terbilang(sisa).replace(' rupiah', '')}` : ''} rupiah`;
  }
  if (value < 200) {
    return `seratus${value > 100 ? ` ${terbilang(value - 100).replace(' rupiah', '')}` : ''} rupiah`;
  }
  if (value < 1000) {
    const ratus = Math.floor(value / 100);
    const sisa = value % 100;
    return `${satuan[ratus]} ratus${sisa ? ` ${terbilang(sisa).replace(' rupiah', '')}` : ''} rupiah`;
  }
  if (value < 2000) {
    return `seribu${value > 1000 ? ` ${terbilang(value - 1000).replace(' rupiah', '')}` : ''} rupiah`;
  }
  if (value < 1000000) {
    const ribu = Math.floor(value / 1000);
    const sisa = value % 1000;
    return `${terbilang(ribu).replace(' rupiah', '')} ribu${sisa ? ` ${terbilang(sisa).replace(' rupiah', '')}` : ''} rupiah`;
  }
  if (value < 1000000000) {
    const juta = Math.floor(value / 1000000);
    const sisa = value % 1000000;
    return `${terbilang(juta).replace(' rupiah', '')} juta${sisa ? ` ${terbilang(sisa).replace(' rupiah', '')}` : ''} rupiah`;
  }
  if (value < 1000000000000) {
    const miliar = Math.floor(value / 1000000000);
    const sisa = value % 1000000000;
    return `${terbilang(miliar).replace(' rupiah', '')} miliar${sisa ? ` ${terbilang(sisa).replace(' rupiah', '')}` : ''} rupiah`;
  }

  const triliun = Math.floor(value / 1000000000000);
  const sisa = value % 1000000000000;
  return `${terbilang(triliun).replace(' rupiah', '')} triliun${sisa ? ` ${terbilang(sisa).replace(' rupiah', '')}` : ''} rupiah`;
};

const getTerbilang = (value: string) => {
  const amount = Number(value.replace(/\D/g, ''));
  const words = terbilang(amount);
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const SectionTitle = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="mb-5 flex gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary text-sm font-semibold text-white">
      {number}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-body dark:text-bodydark">
        {description}
      </p>
    </div>
  </div>
);

const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
      {label}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded border border-stroke bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    />
  </div>
);

const MoneyInput = ({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
      {label}
    </label>
    <div className="flex overflow-hidden rounded border border-stroke bg-white focus-within:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus-within:border-primary">
      <span className="flex items-center border-r border-stroke bg-gray-2 px-4 text-sm font-semibold text-black dark:border-form-strokedark dark:bg-meta-4 dark:text-white">
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        required={required}
        value={formatRupiahText(value)}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
        placeholder="0"
        className="w-full bg-transparent px-4 py-3 text-sm text-black outline-none dark:text-white"
      />
    </div>
    <div className="mt-2 rounded bg-primary/5 px-3 py-2 text-xs font-medium text-primary dark:bg-primary/10">
      Terbilang: {value ? getTerbilang(value) : 'Belum terisi'}
    </div>
  </div>
);

const PegawaiPicker = ({
  label,
  value,
  excludedIds,
  onChange,
}: {
  label: string;
  value: string;
  excludedIds: string[];
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = pegawaiOptions.find((pegawai) => pegawai.id === value);
  const filteredPegawai = pegawaiOptions.filter((pegawai) => {
    const searchable = `${pegawai.nama} ${pegawai.nrp} ${pegawai.jabatan}`.toLowerCase();
    return (
      searchable.includes(query.toLowerCase()) &&
      (!excludedIds.includes(pegawai.id) || pegawai.id === value)
    );
  });

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded border border-stroke bg-white px-4 py-3 text-left transition hover:border-primary dark:border-form-strokedark dark:bg-form-input"
      >
        {selected ? (
          <span>
            <span className="block text-sm font-semibold text-black dark:text-white">
              {selected.nama}
            </span>
            <span className="mt-0.5 block text-xs text-body dark:text-bodydark">
              NRP : {selected.nrp}
            </span>
          </span>
        ) : (
          <span className="text-sm text-body dark:text-bodydark">
            Pilih nama lengkap
          </span>
        )}
        <FiChevronDown
          className={`shrink-0 transition ${open ? 'rotate-180' : ''}`}
          size={18}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[86px] z-40 rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-2 flex items-center gap-2 rounded border border-stroke px-3 py-2 dark:border-form-strokedark">
            <FiSearch size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama atau NRP"
              className="w-full bg-transparent text-sm text-black outline-none dark:text-white"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredPegawai.map((pegawai) => (
              <button
                type="button"
                key={pegawai.id}
                onClick={() => {
                  onChange(pegawai.id);
                  setOpen(false);
                  setQuery('');
                }}
                className="block w-full rounded px-3 py-2 text-left transition hover:bg-gray-2 dark:hover:bg-meta-4"
              >
                <span className="block text-sm font-medium text-black dark:text-white">
                  {pegawai.nama}
                </span>
                <span className="mt-0.5 block text-xs text-body dark:text-bodydark">
                  NRP : {pegawai.nrp} | {pegawai.jabatan}
                </span>
              </button>
            ))}
            {filteredPegawai.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-body dark:text-bodydark">
                Data tidak ditemukan
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProcurementCreate = ({ mode = 'create' }: { mode?: 'create' | 'edit' }) => {
  const { id } = useParams();
  const isEditMode = mode === 'edit';
  const editSeed = getEditSeed(id);
  const [namaPenyedia, setNamaPenyedia] = useState(
    isEditMode ? editSeed.namaPenyedia : ''
  );
  const [dataPenyediaVisible, setDataPenyediaVisible] = useState(isEditMode);
  const [penyedia, setPenyedia] = useState(
    isEditMode ? editSeed.penyedia : penyediaInitial
  );
  const [detail, setDetail] = useState(
    isEditMode ? editSeed.detail : detailInitial
  );
  const [ppkIds, setPpkIds] = useState(isEditMode ? editSeed.ppkIds : ['']);
  const [pbjIds, setPbjIds] = useState(isEditMode ? editSeed.pbjIds : ['']);
  const [penandaTangan, setPenandaTangan] = useState(
    isEditMode ? editSeed.penandaTangan : ['']
  );
  const [kakAktif, setKakAktif] = useState(false);
  const [keteranganGenerated, setKeteranganGenerated] = useState(isEditMode);
  const [tanggalPelaksana, setTanggalPelaksana] = useState(formatTanggalIndonesia());
  const [saved, setSaved] = useState(false);

  const visibleDokumen = useMemo(
    () =>
      dokumenPelaksana.filter((dokumen) => dokumen.wajib || kakAktif),
    [kakAktif]
  );

  const selectedPpkIds = ppkIds.filter(Boolean);
  const selectedPbjIds = pbjIds.filter(Boolean);

  const updatePenyedia = (key: keyof typeof penyedia, value: string) => {
    setPenyedia((current) => ({ ...current, [key]: value }));
  };

  const updateDetail = (key: keyof typeof detail, value: string) => {
    setDetail((current) => ({ ...current, [key]: value }));
  };

  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDataPenyediaVisible(true);
  };

  const generateKeterangan = () => {
    setTanggalPelaksana(formatTanggalIndonesia());
    setKeteranganGenerated(true);
  };

  const addPegawaiRow = (type: 'ppk' | 'pbj') => {
    if (type === 'ppk' && ppkIds.length < 5) {
      setPpkIds((current) => [...current, '']);
    }

    if (type === 'pbj' && pbjIds.length < 5) {
      setPbjIds((current) => [...current, '']);
    }
  };

  const removePegawaiRow = (type: 'ppk' | 'pbj', index: number) => {
    if (type === 'ppk') {
      setPpkIds((current) => current.filter((_, itemIndex) => itemIndex !== index));
    }

    if (type === 'pbj') {
      setPbjIds((current) => current.filter((_, itemIndex) => itemIndex !== index));
    }
  };

  const updatePegawaiRow = (type: 'ppk' | 'pbj', index: number, value: string) => {
    const updater = (current: string[]) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item));

    if (type === 'ppk') setPpkIds(updater);
    if (type === 'pbj') setPbjIds(updater);
  };

  const addPenandaTangan = () => {
    if (penandaTangan.length < 5) {
      setPenandaTangan((current) => [...current, '']);
    }
  };

  const updatePenandaTangan = (index: number, value: string) => {
    setPenandaTangan((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  };

  const removePenandaTangan = (index: number) => {
    setPenandaTangan((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-80"
            >
              <FiArrowLeft size={16} />
              Kembali ke Dashboard
            </Link>
          </div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {isEditMode ? 'Edit Pengadaan' : 'Tambah Pengadaan'}
          </h2>
          <p className="mt-1 text-sm text-body dark:text-bodydark">
            {isEditMode
              ? 'Perbarui data penyedia, dokumen pelaksana, nilai pengadaan, dan data tanda tangan.'
              : 'Lengkapi data penyedia, dokumen pelaksana, nilai pengadaan, dan data tanda tangan.'}
          </p>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-4 py-3 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-xs font-medium uppercase text-body dark:text-bodydark">
            Status Form
          </p>
          <p className="mt-1 text-sm font-semibold text-black dark:text-white">
            {dataPenyediaVisible
              ? isEditMode
                ? 'Mode edit aktif'
                : 'Data penyedia dibuka'
              : 'Menunggu nama penyedia'}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
            <FiFileText size={20} />
          </div>
          <p className="text-sm font-medium">Dokumen Pelaksana</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {visibleDokumen.length}
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-success/10 text-success">
            <FiCheckCircle size={20} />
          </div>
          <p className="text-sm font-medium">PPK Terpilih</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {selectedPpkIds.length}/5
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-warning/10 text-warning">
            <FiCheckCircle size={20} />
          </div>
          <p className="text-sm font-medium">PBJ Terpilih</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {selectedPbjIds.length}/5
          </h3>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
          <SectionTitle
            number="1"
            title="Nama Penyedia"
            description="Masukkan nama penyedia terlebih dahulu untuk membuka form Data Penyedia."
          />
          <form onSubmit={handleContinue}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <TextInput
                label="Nama Penyedia"
                value={namaPenyedia}
                onChange={setNamaPenyedia}
                placeholder="Contoh: PT Nusa Teknologi Mandiri"
                required
              />
              <button
                type="submit"
                className="inline-flex h-[46px] items-center justify-center rounded bg-primary px-5 text-sm font-medium text-white transition hover:bg-opacity-90"
              >
                Lanjutkan
              </button>
            </div>
          </form>
        </div>

        {dataPenyediaVisible && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {saved && (
              <div className="rounded-sm border border-success/30 bg-success/10 px-5 py-4 text-sm font-semibold text-success">
                {isEditMode
                  ? 'Perubahan pengadaan berhasil disimpan sebagai dummy.'
                  : 'Data pengadaan berhasil disimpan sebagai dummy.'}
              </div>
            )}

            <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
              <SectionTitle
                number="2"
                title="Data Penyedia"
                description="Data legal dan kontak penyedia, termasuk nilai penawaran setelah pajak 11%."
              />
              <div className="mb-5 rounded bg-primary/5 px-4 py-3 text-sm font-medium text-primary dark:bg-primary/10">
                Penyedia: {namaPenyedia}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <TextInput
                  label="Alamat"
                  value={penyedia.alamat}
                  onChange={(value) => updatePenyedia('alamat', value)}
                  required
                />
                <TextInput
                  label="Nama Direktur"
                  value={penyedia.namaDirektur}
                  onChange={(value) => updatePenyedia('namaDirektur', value)}
                  required
                />
                <TextInput
                  label="Nomor Identitas/NIP/NRP"
                  value={penyedia.nomorIdentitas}
                  onChange={(value) => updatePenyedia('nomorIdentitas', value)}
                  required
                />
                <TextInput
                  label="Telepon/Fax"
                  value={penyedia.teleponFax}
                  onChange={(value) => updatePenyedia('teleponFax', value)}
                  required
                />
                <TextInput
                  label="Email"
                  type="email"
                  value={penyedia.email}
                  onChange={(value) => updatePenyedia('email', value)}
                  required
                />
                <TextInput
                  label="Jabatan"
                  value={penyedia.jabatan}
                  onChange={(value) => updatePenyedia('jabatan', value)}
                  required
                />
                <MoneyInput
                  label="Harga Penawaran Sudah Pajak 11%"
                  value={penyedia.hargaPenawaranPajak}
                  onChange={(value) => updatePenyedia('hargaPenawaranPajak', value)}
                  required
                />
                <TextInput
                  label="NPWP"
                  value={penyedia.npwp}
                  onChange={(value) => updatePenyedia('npwp', value)}
                  required
                />
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <SectionTitle
                  number="3"
                  title="Keterangan Pelaksana"
                  description="Dokumen wajib aktif otomatis. Kerangka Acuan Kerja bisa dipakai jika diperlukan."
                />
                <button
                  type="button"
                  onClick={generateKeterangan}
                  className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90"
                >
                  <FiFileText size={18} />
                  Generate Keterangan
                </button>
              </div>

              <label className="mb-4 flex items-center gap-3 rounded border border-stroke px-4 py-3 dark:border-strokedark">
                <input
                  type="checkbox"
                  checked={kakAktif}
                  onChange={(event) => setKakAktif(event.target.checked)}
                  className="h-4 w-4 rounded border-stroke text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-semibold text-black dark:text-white">
                    Sertakan Kerangka Acuan Kerja
                  </span>
                  <span className="text-xs text-body dark:text-bodydark">
                    Opsional, boleh ada atau tidak.
                  </span>
                </span>
              </label>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                        Dokumen
                      </th>
                      <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                        Tanggal Pelaksana
                      </th>
                      <th className="px-4 py-4 text-sm font-medium uppercase text-black dark:text-white">
                        Nomor Dokumen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleDokumen.map((dokumen, index) => (
                      <tr
                        key={dokumen.nama}
                        className="border-b border-stroke last:border-b-0 dark:border-strokedark"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-black dark:text-white">
                          {dokumen.nama}
                        </td>
                        <td className="px-4 py-4 text-sm text-black dark:text-white">
                          {keteranganGenerated ? tanggalPelaksana : '-'}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                          {keteranganGenerated ? getNomorDokumen(index) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
              <SectionTitle
                number="4"
                title="Detail Pengadaan"
                description="Nilai HPS, penawaran vendor, dan hasil negosiasi akan langsung dibuatkan terbilangnya."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Judul Pengadaan"
                  value={detail.judulPengadaan}
                  onChange={(value) => updateDetail('judulPengadaan', value)}
                  required
                />
                <MoneyInput
                  label="Perhitungan HPS (Harga Perkiraan Sendiri Sudah Termasuk PPN)"
                  value={detail.perhitunganHps}
                  onChange={(value) => updateDetail('perhitunganHps', value)}
                  required
                />
                <MoneyInput
                  label="Harga yang Ditawarkan Vendor"
                  value={detail.hargaVendor}
                  onChange={(value) => updateDetail('hargaVendor', value)}
                  required
                />
                <MoneyInput
                  label="Hasil Negosiasi"
                  value={detail.hasilNegosiasi}
                  onChange={(value) => updateDetail('hasilNegosiasi', value)}
                  required
                />
                <TextInput
                  label="Tempat Penandatanganan"
                  value={detail.tempatPenandatanganan}
                  onChange={(value) => updateDetail('tempatPenandatanganan', value)}
                  required
                />
                <TextInput
                  label="Peserta"
                  value={detail.peserta}
                  onChange={(value) => updateDetail('peserta', value)}
                  placeholder="Pisahkan dengan koma jika lebih dari satu"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <SectionTitle
                    number="5"
                    title="Nama PPK"
                    description="Pilih maksimal 5 nama PPK dengan pencarian nama atau NRP."
                  />
                  <button
                    type="button"
                    onClick={() => addPegawaiRow('ppk')}
                    disabled={ppkIds.length >= 5}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiPlus size={16} />
                    PPK
                  </button>
                </div>
                <div className="space-y-4">
                  {ppkIds.map((id, index) => (
                    <div key={`ppk-${index}`} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                      <PegawaiPicker
                        label={`Nama Lengkap PPK ${index + 1}`}
                        value={id}
                        excludedIds={selectedPpkIds}
                        onChange={(value) => updatePegawaiRow('ppk', index, value)}
                      />
                      {ppkIds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePegawaiRow('ppk', index)}
                          className="inline-flex h-[52px] w-full items-center justify-center rounded border border-danger text-danger transition hover:bg-danger/10 sm:w-12"
                          aria-label="Hapus PPK"
                          title="Hapus PPK"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <SectionTitle
                    number="6"
                    title="Nama PBJ"
                    description="Pilih maksimal 5 nama PBJ dengan pencarian nama atau NRP."
                  />
                  <button
                    type="button"
                    onClick={() => addPegawaiRow('pbj')}
                    disabled={pbjIds.length >= 5}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiPlus size={16} />
                    PBJ
                  </button>
                </div>
                <div className="space-y-4">
                  {pbjIds.map((id, index) => (
                    <div key={`pbj-${index}`} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                      <PegawaiPicker
                        label={`Nama Lengkap PBJ ${index + 1}`}
                        value={id}
                        excludedIds={selectedPbjIds}
                        onChange={(value) => updatePegawaiRow('pbj', index, value)}
                      />
                      {pbjIds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePegawaiRow('pbj', index)}
                          className="inline-flex h-[52px] w-full items-center justify-center rounded border border-danger text-danger transition hover:bg-danger/10 sm:w-12"
                          aria-label="Hapus PBJ"
                          title="Hapus PBJ"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <SectionTitle
                  number="7"
                  title="Master Data Tanda Tangan"
                  description="Isi nama penanda tangan dokumen, maksimal 5 nama."
                />
                <button
                  type="button"
                  onClick={addPenandaTangan}
                  disabled={penandaTangan.length >= 5}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-4 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiPlus size={16} />
                  Penanda Tangan
                </button>
              </div>

              <div className="space-y-4">
                {penandaTangan.map((nama, index) => (
                  <div
                    key={`penanda-tangan-${index}`}
                    className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
                  >
                    <TextInput
                      label={`Nama Penanda Tangan ${index + 1}`}
                      value={nama}
                      onChange={(value) => updatePenandaTangan(index, value)}
                      placeholder="Contoh: I Made Surya Pratama"
                      required
                    />
                    {penandaTangan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePenandaTangan(index)}
                        className="inline-flex h-[46px] w-full items-center justify-center rounded border border-danger text-danger transition hover:bg-danger/10 sm:w-12"
                        aria-label="Hapus penanda tangan"
                        title="Hapus penanda tangan"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}

                <div className="rounded bg-gray-2 px-4 py-3 text-sm text-body dark:bg-meta-4 dark:text-bodydark">
                  Jumlah penanda tangan: {penandaTangan.length}/5
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-20 -mx-4 border-t border-stroke bg-whiten/95 px-4 py-4 backdrop-blur dark:border-strokedark dark:bg-boxdark-2/95 sm:-mx-6 lg:-mx-8.5 lg:px-8.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded border border-stroke px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90"
                >
                  <FiSave size={18} />
                  {isEditMode ? 'Simpan Perubahan' : 'Simpan Pengadaan'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProcurementCreate;
