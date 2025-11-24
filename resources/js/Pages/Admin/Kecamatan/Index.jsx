import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/modal/Modal';
import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import Button from '@/Components/ui/Button';
import SearchBox from '@/Components/ui/SearchBox';
import { SelectChain } from '@/Components/forms';

const kecamatanSchema = z.object({
    kab_id: z.string().min(1, 'Kabupaten/Kota wajib dipilih'),
    nm_kec: z.string().min(1, 'Nama kecamatan wajib diisi').max(255, 'Nama kecamatan maksimal 255 karakter'),
});

export default function Index({ auth, kecamatan, provinsi, kabKota, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedKecamatan, setSelectedKecamatan] = useState(null);

    // Show toast from flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        prov_id: '',
        kab_id: '',
        nm_kec: '',
    });

    const openModal = (kecamatanData = null) => {
        if (kecamatanData) {
            setSelectedKecamatan(kecamatanData);
            // Get prov_id from kabKota relationship
            const kab = kabKota.find((k) => k.id === kecamatanData.kab_id);
            setData({
                prov_id: kab ? String(kab.prov_id) : '',
                kab_id: String(kecamatanData.kab_id),
                nm_kec: kecamatanData.nm_kec,
            });
        } else {
            setSelectedKecamatan(null);
            setData({
                prov_id: '',
                kab_id: filters?.kab_id || '',
                nm_kec: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKecamatan(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate with Zod
        const submitData = {
            kab_id: data.kab_id,
            nm_kec: data.nm_kec,
        };

        const validation = kecamatanSchema.safeParse(submitData);
        if (!validation.success) {
            return;
        }

        if (selectedKecamatan) {
            // Menggunakan router.patch untuk update
            router.patch(`/admin/kecamatan/${selectedKecamatan.id}`, submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Update error:', errors);
                    // Show error toast only if no flash message (client-side validation errors)
                    if (errors && Object.keys(errors).length > 0 && !errors.message) {
                        const firstError = Object.values(errors)[0];
                        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                },
            });
        } else {
            // Menggunakan router.post untuk create
            router.post('/admin/kecamatan', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Create error:', errors);
                    // Show error toast only if no flash message (client-side validation errors)
                    if (errors && Object.keys(errors).length > 0 && !errors.message) {
                        const firstError = Object.values(errors)[0];
                        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                },
            });
        }
    };

    const handleDelete = (kecamatanData) => {
        setSelectedKecamatan(kecamatanData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedKecamatan) {
            // Menggunakan router.delete untuk destroy
            router.delete(`/admin/kecamatan/${selectedKecamatan.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedKecamatan(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleFilterKabKota = (e) => {
        const kabId = e.target.value;
        router.get(
            '/admin/kecamatan',
            { ...filters, kab_id: kabId || null },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Kecamatan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Kecamatan</h1>
                        <p className="text-base-content/70 mt-1">Kelola data kecamatan di Indonesia</p>
                    </div>
                    <Button onClick={() => openModal()} variant="primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kecamatan
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari kecamatan, kabupaten/kota, atau provinsi..."
                                defaultValue={filters?.search || ''}
                                route="/admin/kecamatan"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Kabupaten/Kota</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters?.kab_id || ''}
                                    onChange={handleFilterKabKota}
                                >
                                    <option value="">Semua Kabupaten/Kota</option>
                                    {kabKota.map((kab) => (
                                        <option key={kab.id} value={kab.id}>
                                            {kab.nm_kab} - {kab.provinsi?.nm_prov}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="200">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Kecamatan</th>
                                        <th>Kabupaten/Kota</th>
                                        <th>Provinsi</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kecamatan.data.length > 0 ? (
                                        kecamatan.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{kecamatan.from + index}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_kec}</div>
                                                </td>
                                                <td>
                                                    <div className="text-sm text-base-content/70">
                                                        {item.kab_kota?.nm_kab || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-sm text-base-content/50">
                                                        {item.kab_kota?.provinsi?.nm_prov || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => openModal(item)}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                            Ubah
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-error"
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-base-content/50">
                                                <p>Tidak ada data kecamatan</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {kecamatan.links && kecamatan.links.length > 3 && (
                            <div className="card-body border-t border-base-300">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-sm text-base-content/70">
                                        Menampilkan {kecamatan.from} sampai {kecamatan.to} dari {kecamatan.total} data
                                    </div>
                                    <div className="join">
                                        {kecamatan.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`join-item btn btn-sm ${
                                                    link.active
                                                        ? 'btn-active'
                                                        : link.url
                                                          ? ''
                                                          : 'btn-disabled'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            <Modal
                id="kecamatan-modal"
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedKecamatan ? 'Ubah Kecamatan' : 'Tambah Kecamatan'}
                size="md"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={closeModal} disabled={processing}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={processing}
                            loading={processing}
                        >
                            {selectedKecamatan ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <SelectChain
                        levels={[
                            {
                                name: 'prov_id',
                                label: 'Provinsi',
                                options: provinsi,
                                optionValue: 'id',
                                optionLabel: 'nm_prov',
                                required: true,
                                placeholder: 'Pilih Provinsi',
                            },
                            {
                                name: 'kab_id',
                                label: 'Kabupaten/Kota',
                                options: kabKota,
                                optionValue: 'id',
                                optionLabel: (kab) => `${kab.nm_kab} - ${kab.provinsi?.nm_prov || ''}`,
                                dependsOn: 'prov_id',
                                foreignKey: 'prov_id',
                                required: true,
                                placeholder: 'Pilih Kabupaten/Kota',
                            },
                        ]}
                        values={data}
                        onChange={(name, value) => setData(name, value)}
                        errors={errors}
                        disabled={processing}
                    />

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Nama Kecamatan <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            className={`input input-bordered w-full ${errors.nm_kec ? 'input-error' : ''}`}
                            placeholder="Masukkan nama kecamatan"
                            value={data.nm_kec}
                            onChange={(e) => setData('nm_kec', e.target.value)}
                            disabled={processing}
                        />
                        {errors.nm_kec && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.nm_kec}</span>
                            </label>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedKecamatan(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Kecamatan"
                message={`Apakah Anda yakin ingin menghapus "${selectedKecamatan?.nm_kec}"?`}
                confirmText="Hapus"
                cancelText="Batal"
                variant="error"
            />
        </AdminLayout>
    );
}

