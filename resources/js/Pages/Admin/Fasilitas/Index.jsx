import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import Modal from '@/Components/modal/Modal';
import Button from '@/Components/ui/Button';
import SearchBox from '@/Components/ui/SearchBox';
import AdminLayout from '@/Layouts/AdminLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

const fasilitasSchema = yup.object({
    nm_fasilitas: yup.string().required('Nama fasilitas wajib diisi').max(255, 'Nama fasilitas maksimal 255 karakter'),
    ket: yup.string().nullable(),
    kapasitas: yup
        .string()
        .nullable()
        .test('is-number', 'Kapasitas harus berupa angka positif', (value) => {
            if (!value || value === '') return true;
            const num = parseInt(value, 10);
            return !isNaN(num) && num >= 0;
        }),
    tersedia: yup.boolean().default(true),
});

export default function Index({ auth, fasilitas, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedFasilitas, setSelectedFasilitas] = useState(null);

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
        register,
        handleSubmit: handleFormSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(fasilitasSchema),
        defaultValues: {
            nm_fasilitas: '',
            ket: '',
            kapasitas: '',
            tersedia: true,
        },
    });

    const tersediaValue = watch('tersedia');

    const openModal = (fasilitasData = null) => {
        if (fasilitasData) {
            setSelectedFasilitas(fasilitasData);
            setValue('nm_fasilitas', fasilitasData.nm_fasilitas);
            setValue('ket', fasilitasData.ket || '');
            setValue('kapasitas', fasilitasData.kapasitas ? String(fasilitasData.kapasitas) : '');
            setValue('tersedia', fasilitasData.tersedia ?? true);
        } else {
            setSelectedFasilitas(null);
            reset({
                nm_fasilitas: '',
                ket: '',
                kapasitas: '',
                tersedia: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFasilitas(null);
        reset({
            nm_fasilitas: '',
            ket: '',
            kapasitas: '',
            tersedia: true,
        });
    };

    const onSubmit = (data) => {
        const submitData = {
            nm_fasilitas: data.nm_fasilitas,
            ket: data.ket || null,
            kapasitas: data.kapasitas ? parseInt(data.kapasitas, 10) : null,
            tersedia: data.tersedia,
        };

        if (selectedFasilitas) {
            router.patch(`/admin/fasilitas/${selectedFasilitas.id}`, submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Update error:', errors);
                    if (errors && Object.keys(errors).length > 0 && !errors.message) {
                        const firstError = Object.values(errors)[0];
                        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                },
            });
        } else {
            router.post('/admin/fasilitas', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    reset({
                        nm_fasilitas: '',
                        ket: '',
                        kapasitas: '',
                        tersedia: true,
                    });
                },
                onError: (errors) => {
                    console.error('Create error:', errors);
                    if (errors && Object.keys(errors).length > 0 && !errors.message) {
                        const firstError = Object.values(errors)[0];
                        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                },
            });
        }
    };

    const handleDetail = (fasilitasData) => {
        setSelectedFasilitas(fasilitasData);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (fasilitasData) => {
        setSelectedFasilitas(fasilitasData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedFasilitas) {
            router.delete(`/admin/fasilitas/${selectedFasilitas.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedFasilitas(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleFilterTersedia = (e) => {
        const tersedia = e.target.value;
        router.get(
            '/admin/fasilitas',
            { ...filters, tersedia: tersedia || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Fasilitas" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Fasilitas</h1>
                        <p className="mt-1 text-base-content/70">Kelola data fasilitas program pendidikan</p>
                    </div>
                    <Button onClick={() => openModal()} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Fasilitas
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari fasilitas..."
                                defaultValue={filters?.search || ''}
                                route="/admin/fasilitas"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Ketersediaan</span>
                                </label>
                                <select
                                    className="select-bordered select w-full"
                                    value={filters?.tersedia !== undefined ? String(filters.tersedia) : ''}
                                    onChange={handleFilterTersedia}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="1">Tersedia</option>
                                    <option value="0">Tidak Tersedia</option>
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
                                        <th>Nama Fasilitas</th>
                                        <th>Keterangan</th>
                                        <th>Kapasitas</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fasilitas.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-base-content/70">
                                                Tidak ada data fasilitas
                                            </td>
                                        </tr>
                                    ) : (
                                        fasilitas.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{fasilitas.from + index}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_fasilitas}</div>
                                                </td>
                                                <td>
                                                    {item.ket ? (
                                                        <div className="line-clamp-2 text-sm text-base-content/70">{item.ket}</div>
                                                    ) : (
                                                        <span className="text-base-content/50">-</span>
                                                    )}
                                                </td>
                                                <td>{item.kapasitas ? item.kapasitas.toLocaleString('id-ID') : '-'}</td>
                                                <td>
                                                    {item.tersedia ? (
                                                        <span className="badge badge-success">Tersedia</span>
                                                    ) : (
                                                        <span className="badge badge-error">Tidak Tersedia</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDetail(item)} title="Detail">
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
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => openModal(item)} title="Edit">
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
                                                        </button>
                                                        <button
                                                            className="btn text-error btn-ghost btn-sm"
                                                            onClick={() => handleDelete(item)}
                                                            title="Hapus"
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
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {fasilitas.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="join">
                            {fasilitas.links.map((link, index) => (
                                <button
                                    key={index}
                                    className={`btn join-item ${link.active ? 'btn-active' : ''} ${link.url ? '' : 'btn-disabled'}`}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal Form */}
                <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedFasilitas ? 'Edit Fasilitas' : 'Tambah Fasilitas'} size="4xl">
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        {/* Nama Fasilitas */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Nama Fasilitas <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input-bordered input w-full ${errors.nm_fasilitas ? 'input-error' : ''}`}
                                {...register('nm_fasilitas')}
                                placeholder="Masukkan nama fasilitas"
                            />
                            {errors.nm_fasilitas && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.nm_fasilitas.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 1: Kapasitas + Status Tersedia */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Jumlah (Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.kapasitas ? 'input-error' : ''}`}
                                    {...register('kapasitas')}
                                    placeholder="Masukkan kapasitas"
                                />
                                {errors.kapasitas && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.kapasitas.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Status Tersedia</span>
                                    <input type="checkbox" className="toggle toggle-primary" checked={tersediaValue} {...register('tersedia')} />
                                </label>
                            </div>
                        </div>

                        {/* Keterangan */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Keterangan (Opsional)</span>
                            </label>
                            <textarea
                                className={`textarea-bordered textarea w-full ${errors.ket ? 'textarea-error' : ''}`}
                                {...register('ket')}
                                placeholder="Masukkan keterangan fasilitas"
                                rows="4"
                            />
                            {errors.ket && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.ket.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="modal-action">
                            <Button type="button" onClick={closeModal} className="btn-ghost">
                                Batal
                            </Button>
                            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-sm loading-spinner"></span>
                                        {selectedFasilitas ? 'Menyimpan...' : 'Menambahkan...'}
                                    </>
                                ) : selectedFasilitas ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Tambah Fasilitas'
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Detail Modal */}
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedFasilitas(null);
                    }}
                    title="Detail Fasilitas"
                    size="3xl"
                >
                    {selectedFasilitas && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="flex items-center gap-4 border-b border-base-300 pb-4">
                                <div className="placeholder avatar">
                                    <div className="w-16 rounded-full bg-primary text-primary-content">
                                        <span className="text-2xl">{selectedFasilitas.nm_fasilitas?.charAt(0).toUpperCase() || 'F'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedFasilitas.nm_fasilitas}</h3>
                                    <p className="text-sm text-base-content/70">
                                        {selectedFasilitas.tersedia ? (
                                            <span className="badge badge-success">Tersedia</span>
                                        ) : (
                                            <span className="badge badge-error">Tidak Tersedia</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Data Fasilitas */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Kapasitas</label>
                                        <p className="mt-1">
                                            {selectedFasilitas.kapasitas ? selectedFasilitas.kapasitas.toLocaleString('id-ID') : '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {selectedFasilitas.ket && (
                                        <div>
                                            <label className="text-sm font-semibold text-base-content/70">Keterangan</label>
                                            <p className="mt-1 whitespace-pre-wrap">{selectedFasilitas.ket}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="modal-action">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        openModal(selectedFasilitas);
                                    }}
                                    className="btn-primary"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5"
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
                                    Edit Fasilitas
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        setSelectedFasilitas(null);
                                    }}
                                    className="btn-ghost"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Confirm Delete Dialog */}
                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setSelectedFasilitas(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Fasilitas"
                    message={`Apakah Anda yakin ingin menghapus fasilitas "${selectedFasilitas?.nm_fasilitas}"?`}
                />
            </div>
        </AdminLayout>
    );
}
