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

const programPendidikanSchema = yup.object({
    nm_prog: yup.string().required('Nama program wajib diisi').max(255, 'Nama program maksimal 255 karakter'),
    kat: yup.string().required('Kategori wajib dipilih'),
    desk: yup.string().required('Deskripsi wajib diisi'),
    tgt_pst: yup.string().required('Target peserta wajib diisi').max(255, 'Target peserta maksimal 255 karakter'),
    durasi: yup.string().required('Durasi wajib diisi').max(255, 'Durasi maksimal 255 karakter'),
    biaya: yup
        .string()
        .optional()
        .test('is-number', 'Biaya harus berupa angka positif', (value) => {
            if (!value || value === '') return true;
            const num = parseFloat(value);
            return !isNaN(num) && num >= 0;
        }),
    is_active: yup.boolean().default(true),
});

const kategoriOptions = ['PAUD', 'Paket A', 'Paket B', 'Paket C', 'Keaksaraan Dasar', 'Keaksaraan Usaha Mandiri', 'Kursus', 'Pendidikan Perempuan'];

export default function Index({ auth, programPendidikan, kategori, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [formKey, setFormKey] = useState(0); // Key to force form re-render

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
        resolver: yupResolver(programPendidikanSchema),
        defaultValues: {
            nm_prog: '',
            kat: '',
            desk: '',
            tgt_pst: '',
            durasi: '',
            biaya: '',
            is_active: true,
        },
    });

    const isActiveValue = watch('is_active');

    const openModal = (programData = null) => {
        if (programData) {
            setSelectedProgram(programData);
            setValue('nm_prog', programData.nm_prog);
            setValue('kat', programData.kat);
            setValue('desk', programData.desk);
            setValue('tgt_pst', programData.tgt_pst);
            setValue('durasi', programData.durasi);
            setValue('biaya', programData.biaya ? String(programData.biaya) : '');
            setValue('is_active', programData.is_active ?? true);
        } else {
            setSelectedProgram(null);
            // Reset form to initial values
            reset({
                nm_prog: '',
                kat: '',
                desk: '',
                tgt_pst: '',
                durasi: '',
                biaya: '',
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProgram(null);
        reset({
            nm_prog: '',
            kat: '',
            desk: '',
            tgt_pst: '',
            durasi: '',
            biaya: '',
            is_active: true,
        });
    };

    const onSubmit = (data) => {
        const submitData = {
            ...data,
            biaya: data.biaya ? parseFloat(data.biaya) : null,
        };

        if (selectedProgram) {
            router.patch(`/admin/program-pendidikan/${selectedProgram.id}`, submitData, {
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
            router.post('/admin/program-pendidikan', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    // Reset form after successful create, but keep modal open
                    reset({
                        nm_prog: '',
                        kat: '',
                        desk: '',
                        tgt_pst: '',
                        durasi: '',
                        biaya: '',
                        is_active: true,
                    });
                    // Modal tetap terbuka untuk menambahkan data lagi
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

    const handleDelete = (programData) => {
        setSelectedProgram(programData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedProgram) {
            router.delete(`/admin/program-pendidikan/${selectedProgram.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProgram(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleFilterKategori = (e) => {
        const kat = e.target.value;
        router.get(
            '/admin/program-pendidikan',
            { ...filters, kat: kat || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterStatus = (e) => {
        const isActive = e.target.value;
        router.get(
            '/admin/program-pendidikan',
            { ...filters, is_active: isActive || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Program Pendidikan" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Program Pendidikan</h1>
                        <p className="mt-1 text-base-content/70">Kelola data program pendidikan</p>
                    </div>
                    <Button onClick={() => openModal()} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Program
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-3">
                            <SearchBox
                                placeholder="Cari program pendidikan..."
                                defaultValue={filters?.search || ''}
                                route="/admin/program-pendidikan"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Kategori</span>
                                </label>
                                <select className="select-bordered select w-full" value={filters?.kat || ''} onChange={handleFilterKategori}>
                                    <option value="">Semua Kategori</option>
                                    {kategori.map((kat) => (
                                        <option key={kat} value={kat}>
                                            {kat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Status</span>
                                </label>
                                <select
                                    className="select-bordered select w-full"
                                    value={filters?.is_active !== undefined ? String(filters.is_active) : ''}
                                    onChange={handleFilterStatus}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="1">Aktif</option>
                                    <option value="0">Tidak Aktif</option>
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
                                        <th>Nama Program</th>
                                        <th>Kategori</th>
                                        <th>Target Peserta</th>
                                        <th>Durasi</th>
                                        <th>Biaya</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programPendidikan.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="py-8 text-center text-base-content/70">
                                                Tidak ada data program pendidikan
                                            </td>
                                        </tr>
                                    ) : (
                                        programPendidikan.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{programPendidikan.from + index}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_prog}</div>
                                                    {item.desk && <div className="line-clamp-1 text-sm text-base-content/70">{item.desk}</div>}
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline">{item.kat}</span>
                                                </td>
                                                <td>{item.tgt_pst}</td>
                                                <td>{item.durasi}</td>
                                                <td>
                                                    {item.biaya ? (
                                                        new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0,
                                                        }).format(item.biaya)
                                                    ) : (
                                                        <span className="text-base-content/50">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {item.is_active ? (
                                                        <span className="badge badge-success">Aktif</span>
                                                    ) : (
                                                        <span className="badge badge-error">Tidak Aktif</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
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
                {programPendidikan.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="join">
                            {programPendidikan.links.map((link, index) => (
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
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={selectedProgram ? 'Edit Program Pendidikan' : 'Tambah Program Pendidikan'}
                    size="4xl"
                >
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        {/* Row 1: Nama Program + Kategori */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Nama Program <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.nm_prog ? 'input-error' : ''}`}
                                    {...register('nm_prog')}
                                    placeholder="Masukkan nama program"
                                />
                                {errors.nm_prog && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.nm_prog.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Kategori <span className="text-error">*</span>
                                    </span>
                                </label>
                                <select className={`select-bordered select w-full ${errors.kat ? 'select-error' : ''}`} {...register('kat')}>
                                    <option value="">Pilih Kategori</option>
                                    {kategoriOptions.map((kat) => (
                                        <option key={kat} value={kat}>
                                            {kat}
                                        </option>
                                    ))}
                                </select>
                                {errors.kat && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.kat.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Deskripsi (Full Width) */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Deskripsi <span className="text-error">*</span>
                                </span>
                            </label>
                            <textarea
                                className={`textarea-bordered textarea w-full ${errors.desk ? 'textarea-error' : ''}`}
                                {...register('desk')}
                                placeholder="Masukkan deskripsi program"
                                rows="4"
                            />
                            {errors.desk && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.desk.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 3: Target Peserta + Durasi */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Target Peserta <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.tgt_pst ? 'input-error' : ''}`}
                                    {...register('tgt_pst')}
                                    placeholder="Masukkan target peserta"
                                />
                                {errors.tgt_pst && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tgt_pst.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Durasi <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.durasi ? 'input-error' : ''}`}
                                    {...register('durasi')}
                                    placeholder="Contoh: 6 bulan, 1 tahun, dll"
                                />
                                {errors.durasi && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.durasi.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Row 4: Biaya + Status Aktif */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Biaya (Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.biaya ? 'input-error' : ''}`}
                                    {...register('biaya')}
                                    placeholder="Masukkan biaya (kosongkan jika gratis)"
                                />
                                {errors.biaya && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.biaya.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Status Aktif</span>
                                    <input type="checkbox" className="toggle toggle-primary" checked={isActiveValue} {...register('is_active')} />
                                </label>
                            </div>
                        </div>

                        <div className="modal-action">
                            <Button type="button" onClick={closeModal} className="btn-ghost">
                                Batal
                            </Button>
                            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-sm loading-spinner"></span>
                                        {selectedProgram ? 'Menyimpan...' : 'Menambahkan...'}
                                    </>
                                ) : selectedProgram ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Tambah Program'
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Confirm Delete Dialog */}
                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setSelectedProgram(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Program Pendidikan"
                    message={`Apakah Anda yakin ingin menghapus program "${selectedProgram?.nm_prog}"?`}
                />
            </div>
        </AdminLayout>
    );
}
