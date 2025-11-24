import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/modal/Modal';
import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import Button from '@/Components/ui/Button';
import SearchBox from '@/Components/ui/SearchBox';

const provinsiSchema = z.object({
    nm_prov: z.string().min(1, 'Nama provinsi wajib diisi').max(255, 'Nama provinsi maksimal 255 karakter'),
});

export default function Index({ auth, provinsi, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProvinsi, setSelectedProvinsi] = useState(null);
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
        nm_prov: '',
    });

    const openModal = (provinsiData = null) => {
        if (provinsiData) {
            setSelectedProvinsi(provinsiData);
            setData({
                nm_prov: provinsiData.nm_prov,
            });
        } else {
            setSelectedProvinsi(null);
            setData({
                nm_prov: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProvinsi(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validation = provinsiSchema.safeParse(data);
        if (!validation.success) {
            setIsSubmitting(false);
            return;
        }

        if (selectedProvinsi) {
            // Menggunakan router.patch untuk update
            router.patch(`/admin/provinsi/${selectedProvinsi.id}`, data, {
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
            post('/admin/provinsi', {
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

    const handleDelete = (provinsiData) => {
        setSelectedProvinsi(provinsiData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedProvinsi) {
            // Menggunakan router.delete untuk destroy
            router.delete(`/admin/provinsi/${selectedProvinsi.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProvinsi(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };


    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Provinsi" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Provinsi</h1>
                        <p className="text-base-content/70 mt-1">Kelola data provinsi di Indonesia</p>
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
                        Tambah Provinsi
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="flex items-end justify-end">
                            <SearchBox
                                placeholder="Cari provinsi..."
                                defaultValue={filters?.search || ''}
                                route="/admin/provinsi"
                                debounceMs={500}
                            />
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
                                        <th>Nama Provinsi</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {provinsi.data.length > 0 ? (
                                        provinsi.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{provinsi.from + index}</td>
                                                <td className="font-medium">{item.nm_prov}</td>
                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
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
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="error"
                                                            size="sm"
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
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-base-content/50">
                                                Tidak ada data provinsi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {provinsi.links.length > 3 && (
                            <div className="card-body border-t border-base-300">
                                <div className="flex justify-center">
                                    <div className="join">
                                        {provinsi.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`join-item btn btn-sm ${
                                                    link.active ? 'btn-active' : ''
                                                } ${!link.url ? 'btn-disabled' : ''}`}
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
                id="provinsi-modal"
                isOpen={isModalOpen}
                onClose={() => !isSubmitting && closeModal()}
                title={selectedProvinsi ? 'Edit Provinsi' : 'Tambah Provinsi'}
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={closeModal} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={isSubmitting || processing}>
                            {selectedProvinsi ? 'Simpan Perubahan' : 'Tambah'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Nama Provinsi <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama provinsi"
                                className={`input input-bordered w-full ${errors.nm_prov ? 'input-error' : ''}`}
                                value={data.nm_prov}
                                onChange={(e) => setData('nm_prov', e.target.value)}
                                disabled={isSubmitting || processing}
                            />
                            {errors.nm_prov && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.nm_prov}</span>
                                </label>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                id="delete-provinsi-dialog"
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Provinsi"
                message={`Apakah Anda yakin ingin menghapus provinsi "${selectedProvinsi?.nm_prov}"?`}
                confirmText="Hapus"
                cancelText="Batal"
                variant="error"
                loading={processing}
            />
        </AdminLayout>
    );
}

