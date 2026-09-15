import { FormEvent, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiUserCheck, FiX } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

type UserStatus = 'Aktif' | 'Nonaktif';

type AppUser = {
  id: number;
  nama: string;
  email: string;
  role: string;
  unit: string;
  status: UserStatus;
};

type ModalMode = 'add' | 'edit' | 'delete';

const initialUsers: AppUser[] = [
  {
    id: 1,
    nama: 'Admin SIPINTAR',
    email: 'admin@bprntb.com',
    role: 'Administrator',
    unit: 'Pengadaan Internal',
    status: 'Aktif',
  },
  {
    id: 2,
    nama: 'Rina Kartika',
    email: 'rina.kartika@bprntb.com',
    role: 'Verifikator',
    unit: 'Operasional',
    status: 'Aktif',
  },
  {
    id: 3,
    nama: 'Dimas Pratama',
    email: 'dimas.pratama@bprntb.com',
    role: 'Pemohon',
    unit: 'Umum',
    status: 'Nonaktif',
  },
];

const emptyForm = {
  nama: '',
  email: '',
  role: 'Pemohon',
  unit: '',
  status: 'Aktif' as UserStatus,
};

const UserManagement = () => {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!modalMode) return;

    const animationFrame = requestAnimationFrame(() => {
      setIsModalVisible(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [modalMode]);

  const openModal = (mode: ModalMode, user?: AppUser) => {
    setModalMode(mode);
    setSelectedUser(user ?? null);
    setIsModalVisible(false);
    setForm(
      user
        ? {
            nama: user.nama,
            email: user.email,
            role: user.role,
            unit: user.unit,
            status: user.status,
          }
        : emptyForm
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    window.setTimeout(() => {
      setModalMode(null);
      setSelectedUser(null);
    }, 200);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (modalMode === 'add') {
      setUsers((currentUsers) => [
        ...currentUsers,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    if (modalMode === 'edit' && selectedUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...form,
              }
            : user
        )
      );
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!selectedUser) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== selectedUser.id)
    );
    closeModal();
  };

  const activeUsers = users.filter((user) => user.status === 'Aktif').length;

  return (
    <>
      <Breadcrumb pageName="Manajemen Pengguna" />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm font-medium">Total Pengguna</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {users.length}
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm font-medium">Pengguna Aktif</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {activeUsers}
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm font-medium">Role Tersedia</p>
          <h3 className="mt-2 text-2xl font-bold text-black dark:text-white">
            3
          </h3>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7.5">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Daftar Pengguna
            </h4>
            <p className="mt-1 text-sm text-body dark:text-bodydark">
              Kelola pengguna yang dapat mengakses SIPINTAR.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModal('add')}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 font-medium text-white transition hover:bg-opacity-90"
          >
            <FiPlus size={18} />
            Tambah Pengguna
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-5 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Nama
                </th>
                <th className="px-5 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Email
                </th>
                <th className="px-5 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Role
                </th>
                <th className="px-5 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Unit
                </th>
                <th className="px-5 py-4 text-sm font-medium uppercase text-black dark:text-white">
                  Status
                </th>
                <th className="px-5 py-4 text-center text-sm font-medium uppercase text-black dark:text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-stroke last:border-b-0 dark:border-strokedark"
                >
                  <td className="px-5 py-4 text-sm font-medium text-black dark:text-white">
                    {user.nama}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {user.role}
                  </td>
                  <td className="px-5 py-4 text-sm text-black dark:text-white">
                    {user.unit}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        user.status === 'Aktif'
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openModal('edit', user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-primary/10 hover:text-primary dark:text-bodydark"
                        title="Edit"
                        aria-label="Edit pengguna"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal('delete', user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body transition hover:bg-danger/10 hover:text-danger dark:text-bodydark"
                        title="Hapus"
                        aria-label="Hapus pengguna"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            className={`w-full max-w-[480px] rounded-sm border border-stroke bg-white shadow-default transition-all duration-200 dark:border-strokedark dark:bg-boxdark ${
              isModalVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-95 opacity-0'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stroke px-5 py-4 dark:border-strokedark">
              <h3 className="text-base font-semibold text-black dark:text-white">
                {modalMode === 'add' && 'Tambah Pengguna'}
                {modalMode === 'edit' && 'Edit Pengguna'}
                {modalMode === 'delete' && 'Hapus Pengguna'}
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
              {modalMode === 'delete' && selectedUser ? (
                <>
                  <p className="text-sm text-body dark:text-bodydark">
                    Yakin ingin menghapus pengguna ini?
                  </p>
                  <div className="mt-4 rounded bg-gray-2 p-4 dark:bg-meta-4">
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {selectedUser.nama}
                    </p>
                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                      {selectedUser.email}
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
                  <div className="mb-3">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Nama
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nama}
                      onChange={(event) =>
                        setForm((value) => ({ ...value, nama: event.target.value }))
                      }
                      className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) =>
                        setForm((value) => ({
                          ...value,
                          email: event.target.value,
                        }))
                      }
                      className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Role
                      </label>
                      <select
                        value={form.role}
                        onChange={(event) =>
                          setForm((value) => ({
                            ...value,
                            role: event.target.value,
                          }))
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Verifikator">Verifikator</option>
                        <option value="Pemohon">Pemohon</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(event) =>
                          setForm((value) => ({
                            ...value,
                            status: event.target.value as UserStatus,
                          }))
                        }
                        className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Unit
                    </label>
                    <input
                      type="text"
                      required
                      value={form.unit}
                      onChange={(event) =>
                        setForm((value) => ({ ...value, unit: event.target.value }))
                      }
                      className="w-full rounded border border-stroke bg-transparent px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
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

export default UserManagement;
