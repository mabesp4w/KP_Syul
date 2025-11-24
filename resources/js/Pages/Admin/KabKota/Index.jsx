import { SelectChain } from '@/Components/forms';
import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import Modal from '@/Components/modal/Modal';
import Button from '@/Components/ui/Button';
import SearchBox from '@/Components/ui/SearchBox';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

const kabKotaSchema = z.object({
    prov_id: z.string().min(1, 'Provinsi wajib dipilih'),
    nm_kab: z.string().min(1, 'Nama kabupaten/kota wajib diisi').max(255, 'Nama kabupaten/kota maksimal 255 karakter'),
});

export default function Index({ auth, kabKota, provinsi, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedKabKota, setSelectedKabKota] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        nm_kab: '',
    });

    const openModal = (kabKotaData = null) => {
        if (kabKotaData) {
            setSelectedKabKota(kabKotaData);
            setData({
                prov_id: String(kabKotaData.prov_id),
                nm_kab: kabKotaData.nm_kab,
            });
        } else {
            setSelectedKabKota(null);
            setData({
                prov_id: filters?.prov_id || '',
                nm_kab: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKabKota(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validation = kabKotaSchema.safeParse(data);
        if (!validation.success) {
            setIsSubmitting(false);
            return;
        }

        if (selectedKabKota) {
            // Menggunakan router.patch untuk update
            router.patch(`/admin/kab-kota/${selectedKabKota.id}`, data, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Update error:', errors);
                    // Show error toast only if no flash message (client-side validation errors)
                    if (errors && Object.keys(errors).length > 0 && !errors.message) {
                        const firstError = Object.values(errors)[0];
                        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                    setIsSubmitting(false);
                },
            });
        } else {
            // Menggunakan post untuk create
            post('/admin/kab-kota', {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Create error:', errors);
                    // Show error toast only if no flash message (client-side validation errors)
                    if (errors && Object.keys(errors).length > 0 && !errors.message) {
                        const firstError = Object.values(errors)[0];
                        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleDelete = (kabKotaData) => {
        setSelectedKabKota(kabKotaData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedKabKota) {
            // Menggunakan router.delete untuk destroy
            router.delete(`/admin/kab-kota/${selectedKabKota.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedKabKota(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleFilterProvinsi = (e) => {
        const provId = e.target.value;
        router.get(
            '/admin/kab-kota',
            { ...filters, prov_id: provId || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Kabupaten/Kota" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Kabupaten/Kota</h1>
                        <p className="mt-1 text-base-content/70">Kelola data kabupaten/kota di Indonesia</p>
                    </div>
                    <Button onClick={() => openModal()} variant="primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kabupaten/Kota
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari kabupaten/kota atau provinsi..."
                                defaultValue={filters?.search || ''}
                                route="/admin/kab-kota"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Provinsi</span>
                                </label>
                                <select className="select-bordered select w-full" value={filters?.prov_id || ''} onChange={handleFilterProvinsi}>
                                    <option value="">Semua Provinsi</option>
                                    {provinsi.map((prov) => (
                                        <option key={prov.id} value={prov.id}>
                                            {prov.nm_prov}
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
                                        <th>Nama Kabupaten/Kota</th>
                                        <th>Provinsi</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kabKota.data.length > 0 ? (
                                        kabKota.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{kabKota.from + index}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_kab}</div>
                                                </td>
                                                <td>
                                                    <div className="text-sm text-base-content/70">{item.provinsi?.nm_prov || '-'}</div>
                                                </td>
                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        <button className="btn btn-sm btn-primary" onClick={() => openModal(item)}>
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
                                                        <button className="btn btn-sm btn-error" onClick={() => handleDelete(item)}>
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
                                            <td colSpan="4" className="py-8 text-center text-base-content/50">
                                                <p>Tidak ada data kabupaten/kota</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {kabKota.links && kabKota.links.length > 3 && (
                            <div className="card-body border-t border-base-300">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-sm text-base-content/70">
                                        Menampilkan {kabKota.from} sampai {kabKota.to} dari {kabKota.total} data
                                    </div>
                                    <div className="join">
                                        {kabKota.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`btn join-item btn-sm ${link.active ? 'btn-active' : link.url ? '' : 'btn-disabled'}`}
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
                id="kab-kota-modal"
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedKabKota ? 'Ubah Kabupaten/Kota' : 'Tambah Kabupaten/Kota'}
                size="md"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={closeModal} disabled={isSubmitting || processing}>
                            Batal
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || processing} loading={isSubmitting || processing}>
                            {selectedKabKota ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        ]}
                        values={data}
                        onChange={(name, value) => setData(name, value)}
                        errors={errors}
                        disabled={isSubmitting || processing}
                    />

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Nama Kabupaten/Kota <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            className={`input-bordered input w-full ${errors.nm_kab ? 'input-error' : ''}`}
                            placeholder="Masukkan nama kabupaten/kota"
                            value={data.nm_kab}
                            onChange={(e) => setData('nm_kab', e.target.value)}
                            disabled={isSubmitting || processing}
                        />
                        {errors.nm_kab && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.nm_kab}</span>
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
                    setSelectedKabKota(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Kabupaten/Kota"
                message={`Apakah Anda yakin ingin menghapus "${selectedKabKota?.nm_kab}"?`}
                confirmText="Hapus"
                cancelText="Batal"
                variant="error"
            />
        </AdminLayout>
    );
}
