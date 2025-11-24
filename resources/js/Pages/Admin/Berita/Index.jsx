import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import Modal from '@/Components/modal/Modal';
import Button from '@/Components/ui/Button';
import SearchBox from '@/Components/ui/SearchBox';
import RichText from '@/Components/ui/RichText';
import AdminLayout from '@/Layouts/AdminLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

const beritaSchema = yup.object({
    kegiatan_id: yup.string().nullable(),
    judul: yup.string().required('Judul wajib diisi').max(255, 'Judul maksimal 255 karakter'),
    isi: yup.string().required('Isi berita wajib diisi'),
    tgl_pub: yup
        .date()
        .transform((value, originalValue) => {
            return originalValue ? new Date(originalValue) : null;
        })
        .required('Tanggal publish wajib diisi')
        .typeError('Tanggal publish harus berupa tanggal yang valid'),
    penulis: yup.string().required('Penulis wajib diisi').max(255, 'Penulis maksimal 255 karakter'),
    kat: yup.string().required('Kategori wajib dipilih').oneOf(['pengumuman', 'acara', 'prestasi', 'info_umum'], 'Kategori tidak valid'),
    foto_utama: yup.mixed().nullable(),
    is_published: yup.boolean().default(false),
});

const kategoriOptions = [
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'acara', label: 'Acara' },
    { value: 'prestasi', label: 'Prestasi' },
    { value: 'info_umum', label: 'Info Umum' },
];

export default function Index({ auth, berita, kegiatan, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

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
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(beritaSchema),
        defaultValues: {
            kegiatan_id: '',
            judul: '',
            isi: '',
            tgl_pub: new Date().toISOString().split('T')[0],
            penulis: '',
            kat: '',
            foto_utama: null,
            is_published: false,
        },
    });

    const isPublishedValue = watch('is_published');
    const fotoUtamaValue = watch('foto_utama');

    const openModal = (beritaData = null) => {
        if (beritaData) {
            setSelectedBerita(beritaData);
            setValue('kegiatan_id', beritaData.kegiatan_id || '');
            setValue('judul', beritaData.judul);
            setValue('isi', beritaData.isi);
            setValue('tgl_pub', beritaData.tgl_pub ? new Date(beritaData.tgl_pub).toISOString().split('T')[0] : '');
            setValue('penulis', beritaData.penulis);
            setValue('kat', beritaData.kat);
            setValue('foto_utama', null);
            setValue('is_published', beritaData.is_published ?? false);
            setPreviewImage(beritaData.foto_utama ? `/storage/${beritaData.foto_utama}` : null);
        } else {
            setSelectedBerita(null);
            reset({
                kegiatan_id: '',
                judul: '',
                isi: '',
                tgl_pub: new Date().toISOString().split('T')[0],
                penulis: '',
                kat: '',
                foto_utama: null,
                is_published: false,
            });
            setPreviewImage(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBerita(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        reset({
            kegiatan_id: '',
            judul: '',
            isi: '',
            tgl_pub: new Date().toISOString().split('T')[0],
            penulis: '',
            kat: '',
            foto_utama: null,
            is_published: false,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('foto_utama', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        
        if (data.kegiatan_id) {
            formData.append('kegiatan_id', data.kegiatan_id);
        }
        formData.append('judul', data.judul);
        formData.append('isi', data.isi);
        // Convert Date object to YYYY-MM-DD format for backend
        const tglPub = data.tgl_pub instanceof Date 
            ? data.tgl_pub.toISOString().split('T')[0] 
            : data.tgl_pub;
        formData.append('tgl_pub', tglPub);
        formData.append('penulis', data.penulis);
        formData.append('kat', data.kat);
        formData.append('is_published', data.is_published ? '1' : '0');
        
        if (data.foto_utama instanceof File) {
            formData.append('foto_utama', data.foto_utama);
        }

        if (selectedBerita) {
            formData.append('_method', 'PATCH');
            router.post(`/admin/berita/${selectedBerita.id}`, formData, {
                preserveScroll: true,
                forceFormData: true,
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
            router.post('/admin/berita', formData, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    reset({
                        kegiatan_id: '',
                        judul: '',
                        isi: '',
                        tgl_pub: new Date().toISOString().split('T')[0],
                        penulis: '',
                        kat: '',
                        foto_utama: null,
                        is_published: false,
                    });
                    setPreviewImage(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
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

    const handleDelete = (beritaData) => {
        setSelectedBerita(beritaData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedBerita) {
            router.delete(`/admin/berita/${selectedBerita.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedBerita(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleFilterKategori = (e) => {
        router.get(
            '/admin/berita',
            { ...filters, kat: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    const handleFilterPublished = (e) => {
        router.get(
            '/admin/berita',
            { ...filters, is_published: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    const handleFilterKegiatan = (e) => {
        router.get(
            '/admin/berita',
            { ...filters, kegiatan_id: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Berita" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Manajemen Berita</h1>
                        <p className="mt-1 text-base-content/70">Kelola data berita dan pengumuman</p>
                    </div>
                    <Button onClick={() => openModal()} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Berita
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <SearchBox
                                placeholder="Cari berita..."
                                defaultValue={filters?.search || ''}
                                route="/admin/berita"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Kategori</span>
                                </label>
                                <select
                                    className="select-bordered select w-full"
                                    value={filters?.kat || ''}
                                    onChange={handleFilterKategori}
                                >
                                    <option value="">Semua Kategori</option>
                                    {kategoriOptions.map((kat) => (
                                        <option key={kat.value} value={kat.value}>
                                            {kat.label}
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
                                    value={filters?.is_published !== undefined ? String(filters.is_published) : ''}
                                    onChange={handleFilterPublished}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="1">Published</option>
                                    <option value="0">Draft</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Kegiatan</span>
                                </label>
                                <select
                                    className="select-bordered select w-full"
                                    value={filters?.kegiatan_id || ''}
                                    onChange={handleFilterKegiatan}
                                >
                                    <option value="">Semua Kegiatan</option>
                                    {kegiatan.map((keg) => (
                                        <option key={keg.id} value={keg.id}>
                                            {keg.nm_kegiatan} - {new Date(keg.tgl_kegiatan).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Berita Cards */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="200">
                    <div className="card-body">
                        {berita.data.length === 0 ? (
                            <div className="py-12 text-center text-base-content/70">Tidak ada data berita</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {berita.data.map((item) => (
                                    <div key={item.id} className="card bg-base-200 shadow-sm">
                                        {item.foto_utama && (
                                            <figure className="aspect-video">
                                                <img
                                                    src={`/storage/${item.foto_utama}`}
                                                    alt={item.judul}
                                                    className="h-full w-full object-cover"
                                                />
                                            </figure>
                                        )}
                                        <div className="card-body p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="card-title text-base line-clamp-2 flex-1">{item.judul}</h3>
                                                <span className="badge badge-primary badge-sm whitespace-nowrap">
                                                    {kategoriOptions.find((k) => k.value === item.kat)?.label || item.kat}
                                                </span>
                                            </div>
                                            <div className="mt-2 space-y-1 text-sm text-base-content/70">
                                                <div className="flex items-center gap-2">
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
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    <span>{item.penulis}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
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
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span>{new Date(item.tgl_pub).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div>
                                                    {item.is_published ? (
                                                        <span className="badge badge-success badge-sm">Published</span>
                                                    ) : (
                                                        <span className="badge badge-warning badge-sm">Draft</span>
                                                    )}
                                                </div>
                                                <div className="card-actions gap-2">
                                                    {item.slug && item.is_published && (
                                                        <a
                                                            href={`/berita/${item.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-primary btn-xs"
                                                            title="Baca"
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
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            Baca
                                                        </a>
                                                    )}
                                                    <button
                                                        className="btn btn-ghost btn-xs"
                                                        onClick={() => openModal(item)}
                                                        title="Edit"
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
                                                    </button>
                                                    <button
                                                        className="btn text-error btn-ghost btn-xs"
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {berita.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="join">
                            {berita.links.map((link, index) => (
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
                <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedBerita ? 'Edit Berita' : 'Tambah Berita'} size="5xl">
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        {/* Row 1: Kegiatan (Optional) */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Kegiatan (Opsional)</span>
                            </label>
                            <select className="select-bordered select w-full" {...register('kegiatan_id')}>
                                <option value="">Pilih Kegiatan</option>
                                {kegiatan.map((keg) => (
                                    <option key={keg.id} value={keg.id}>
                                        {keg.nm_kegiatan} - {new Date(keg.tgl_kegiatan).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Row 2: Judul */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Judul <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input-bordered input w-full ${errors.judul ? 'input-error' : ''}`}
                                {...register('judul')}
                                placeholder="Masukkan judul berita"
                            />
                            {errors.judul && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.judul.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 3: Isi */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Isi Berita <span className="text-error">*</span>
                                </span>
                            </label>
                            <Controller
                                name="isi"
                                control={control}
                                render={({ field }) => (
                                    <RichText
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        error={errors.isi?.message}
                                        height={400}
                                    />
                            )}
                            />
                        </div>

                        {/* Row 4: Tanggal Publish, Penulis, Kategori */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Tanggal Publish <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-bordered input w-full ${errors.tgl_pub ? 'input-error' : ''}`}
                                    {...register('tgl_pub')}
                                />
                                {errors.tgl_pub && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tgl_pub.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Penulis <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.penulis ? 'input-error' : ''}`}
                                    {...register('penulis')}
                                    placeholder="Masukkan nama penulis"
                                />
                                {errors.penulis && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.penulis.message}</span>
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
                                        <option key={kat.value} value={kat.value}>
                                            {kat.label}
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

                        {/* Row 5: Foto Utama */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Foto Utama (Opsional)</span>
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="file-input-bordered file-input w-full"
                                onChange={handleFileChange}
                            />
                            {previewImage && (
                                <div className="mt-4">
                                    <img src={previewImage} alt="Preview" className="max-h-64 rounded-lg object-cover" />
                                </div>
                            )}
                            {errors.foto_utama && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.foto_utama.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 6: Is Published */}
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Published</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={isPublishedValue}
                                    {...register('is_published')}
                                />
                            </label>
                        </div>

                        <div className="modal-action">
                            <Button type="button" onClick={closeModal} className="btn-ghost">
                                Batal
                            </Button>
                            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-sm loading-spinner"></span>
                                        {selectedBerita ? 'Menyimpan...' : 'Menambahkan...'}
                                    </>
                                ) : selectedBerita ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Tambah Berita'
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
                        setSelectedBerita(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Berita"
                    message={`Apakah Anda yakin ingin menghapus berita "${selectedBerita?.judul}"?`}
                />
            </div>
        </AdminLayout>
    );
}

