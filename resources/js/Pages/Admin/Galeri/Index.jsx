import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import Modal from '@/Components/modal/Modal';
import Button from '@/Components/ui/Button';
import SearchBox from '@/Components/ui/SearchBox';
import AdminLayout from '@/Layouts/AdminLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import * as yup from 'yup';

const galeriSchema = yup.object({
    judul: yup.string().nullable().max(255, 'Judul maksimal 255 karakter'),
    desk: yup.string().nullable(),
    gambar: yup.mixed().nullable(),
    tipe: yup.string().nullable().oneOf(['kegiatan', 'fasilitas', 'umum'], 'Tipe tidak valid'),
    kegiatan_id: yup.string().nullable(),
    fasilitas_id: yup.string().nullable(),
});

export default function Index({ auth, galeri, kegiatan, fasilitas, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedGaleri, setSelectedGaleri] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Show toast from flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Inject custom styles for lightbox blur
    useEffect(() => {
        const styleId = 'lightbox-blur-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .yarl__backdrop {
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                    background-color: rgba(0, 0, 0, 0.2) !important;
                }
                .yarl__container {
                    background-color: transparent !important;
                }
                .yarl__root {
                    --yarl__color_backdrop: rgba(0, 0, 0, 0.2) !important;
                }
                .yarl__root .yarl__backdrop {
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                    background-color: rgba(0, 0, 0, 0.2) !important;
                }
                /* Ensure parent elements support backdrop-filter */
                .yarl__root,
                .yarl__root > div {
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const {
        register,
        handleSubmit: handleFormSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(galeriSchema),
        defaultValues: {
            judul: '',
            desk: '',
            gambar: null,
            tipe: 'umum',
            kegiatan_id: '',
            fasilitas_id: '',
        },
    });

    const gambarValue = watch('gambar');
    const tipeValue = watch('tipe');

    // Reset kegiatan_id/fasilitas_id when tipe changes
    useEffect(() => {
        if (tipeValue === 'kegiatan') {
            setValue('fasilitas_id', '');
        } else if (tipeValue === 'fasilitas') {
            setValue('kegiatan_id', '');
        } else {
            setValue('kegiatan_id', '');
            setValue('fasilitas_id', '');
        }
    }, [tipeValue, setValue]);

    const openModal = (galeriData = null) => {
        if (galeriData) {
            setSelectedGaleri(galeriData);
            // Handle null, 'null' string, or empty values
            const judulValue = galeriData.judul && galeriData.judul !== 'null' ? galeriData.judul : '';
            setValue('judul', judulValue);
            setValue('desk', galeriData.desk || '');
            setValue('gambar', null);
            setPreviewImage(galeriData.gambar ? `/storage/${galeriData.gambar}` : null);

            // Set tipe dan id berdasarkan relasi
            if (galeriData.kegiatan && galeriData.kegiatan.length > 0) {
                setValue('tipe', 'kegiatan');
                setValue('kegiatan_id', String(galeriData.kegiatan[0].id));
                setValue('fasilitas_id', '');
            } else if (galeriData.fasilitas && galeriData.fasilitas.length > 0) {
                setValue('tipe', 'fasilitas');
                setValue('fasilitas_id', String(galeriData.fasilitas[0].id));
                setValue('kegiatan_id', '');
            } else {
                setValue('tipe', 'umum');
                setValue('kegiatan_id', '');
                setValue('fasilitas_id', '');
            }
        } else {
            setSelectedGaleri(null);
            reset({
                judul: '',
                desk: '',
                gambar: null,
                tipe: 'umum',
                kegiatan_id: '',
                fasilitas_id: '',
            });
            setPreviewImage(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGaleri(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        reset({
            judul: '',
            desk: '',
            gambar: null,
            tipe: 'umum',
            kegiatan_id: '',
            fasilitas_id: '',
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('gambar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data) => {
        // Validate gambar for create
        if (!selectedGaleri && !(data.gambar instanceof File)) {
            toast.error('Gambar wajib diupload');
            return;
        }

        const formData = new FormData();

        formData.append('judul', data.judul);
        if (data.desk) {
            formData.append('desk', data.desk);
        }

        // Add tipe and related id
        if (data.tipe) {
            formData.append('tipe', data.tipe);
        }
        if (data.tipe === 'kegiatan' && data.kegiatan_id) {
            formData.append('kegiatan_id', data.kegiatan_id);
        }
        if (data.tipe === 'fasilitas' && data.fasilitas_id) {
            formData.append('fasilitas_id', data.fasilitas_id);
        }

        // For update, gambar is optional
        if (selectedGaleri) {
            if (data.gambar instanceof File) {
                formData.append('gambar', data.gambar);
            }
            formData.append('_method', 'PATCH');
            router.post(`/admin/galeri/${selectedGaleri.id}`, formData, {
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
            // For create, gambar is required
            if (data.gambar instanceof File) {
                formData.append('gambar', data.gambar);
            }
            router.post('/admin/galeri', formData, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    reset({
                        judul: '',
                        desk: '',
                        gambar: null,
                        tipe: 'umum',
                        kegiatan_id: '',
                        fasilitas_id: '',
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

    const handleDelete = (galeriData) => {
        setSelectedGaleri(galeriData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedGaleri) {
            router.delete(`/admin/galeri/${selectedGaleri.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedGaleri(null);
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
            <Head title="Manajemen Galeri" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Manajemen Galeri</h1>
                        <p className="mt-1 text-base-content/70">Kelola data galeri foto</p>
                    </div>
                    <Button onClick={() => openModal()} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Galeri
                    </Button>
                </div>

                {/* Search */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari galeri..."
                                defaultValue={filters?.search || ''}
                                route="/admin/galeri"
                                routeParams={filters}
                                debounceMs={500}
                            />
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="200">
                    <div className="card-body">
                        {galeri.data.length === 0 ? (
                            <div className="py-12 text-center text-base-content/70">Tidak ada data galeri</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {galeri.data.map((item) => (
                                    <div key={item.id} className="card bg-base-200 shadow-sm">
                                        <figure
                                            className="aspect-square cursor-pointer"
                                            onClick={() => {
                                                // Filter hanya item yang punya gambar, lalu cari index
                                                const itemsWithImages = galeri.data.filter((g) => g.gambar);
                                                const index = itemsWithImages.findIndex((g) => g.id === item.id);
                                                setLightboxIndex(index >= 0 ? index : 0);
                                                setLightboxOpen(true);
                                            }}
                                        >
                                            <img
                                                src={item.gambar ? `/storage/${item.gambar}` : '/placeholder-image.jpg'}
                                                alt={item.judul && item.judul !== 'null' ? item.judul : 'Galeri'}
                                                className="h-full w-full object-cover"
                                            />
                                        </figure>
                                        <div className="card-body p-4">
                                            <h3 className="card-title text-sm">{item.judul}</h3>
                                            <p className="line-clamp-2 text-xs text-base-content/70">{item.desk}</p>
                                            {item.kegiatan && item.kegiatan.length > 0 && (
                                                <div className="mt-2">
                                                    <span className="badge badge-sm badge-primary">Kegiatan: {item.kegiatan[0].nm_kegiatan}</span>
                                                </div>
                                            )}
                                            {item.fasilitas && item.fasilitas.length > 0 && (
                                                <div className="mt-2">
                                                    <span className="badge badge-sm badge-secondary">
                                                        Fasilitas: {item.fasilitas[0].nm_fasilitas}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="mt-2 card-actions justify-end">
                                                <button className="btn btn-ghost btn-xs" onClick={() => openModal(item)} title="Edit">
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
                                                <button className="btn text-error btn-ghost btn-xs" onClick={() => handleDelete(item)} title="Hapus">
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {galeri.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="join">
                            {galeri.links.map((link, index) => (
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
                <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedGaleri ? 'Edit Galeri' : 'Tambah Galeri'} size="3xl">
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        {/* Judul */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Judul (Opsional)</span>
                            </label>
                            <input
                                type="text"
                                className={`input-bordered input w-full ${errors.judul ? 'input-error' : ''}`}
                                {...register('judul')}
                                placeholder="Masukkan judul galeri"
                            />
                            {errors.judul && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.judul.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Deskripsi */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Deskripsi (Opsional)</span>
                            </label>
                            <textarea
                                className={`textarea-bordered textarea w-full ${errors.desk ? 'textarea-error' : ''}`}
                                {...register('desk')}
                                placeholder="Masukkan deskripsi galeri"
                                rows="3"
                            />
                            {errors.desk && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.desk.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Tipe */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Tipe</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="label cursor-pointer gap-2">
                                    <input type="radio" className="radio radio-primary" value="umum" {...register('tipe')} />
                                    <span className="label-text">Umum</span>
                                </label>
                                <label className="label cursor-pointer gap-2">
                                    <input type="radio" className="radio radio-primary" value="kegiatan" {...register('tipe')} />
                                    <span className="label-text">Kegiatan</span>
                                </label>
                                <label className="label cursor-pointer gap-2">
                                    <input type="radio" className="radio radio-primary" value="fasilitas" {...register('tipe')} />
                                    <span className="label-text">Fasilitas</span>
                                </label>
                            </div>
                            {errors.tipe && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.tipe.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Kegiatan (muncul jika tipe = kegiatan) */}
                        {tipeValue === 'kegiatan' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Kegiatan <span className="text-error">*</span>
                                    </span>
                                </label>
                                <select
                                    className={`select-bordered select w-full ${errors.kegiatan_id ? 'select-error' : ''}`}
                                    {...register('kegiatan_id')}
                                >
                                    <option value="">Pilih Kegiatan</option>
                                    {kegiatan.map((keg) => (
                                        <option key={keg.id} value={keg.id}>
                                            {keg.nm_kegiatan}
                                        </option>
                                    ))}
                                </select>
                                {errors.kegiatan_id && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.kegiatan_id.message}</span>
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Fasilitas (muncul jika tipe = fasilitas) */}
                        {tipeValue === 'fasilitas' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Fasilitas <span className="text-error">*</span>
                                    </span>
                                </label>
                                <select
                                    className={`select-bordered select w-full ${errors.fasilitas_id ? 'select-error' : ''}`}
                                    {...register('fasilitas_id')}
                                >
                                    <option value="">Pilih Fasilitas</option>
                                    {fasilitas.map((fas) => (
                                        <option key={fas.id} value={fas.id}>
                                            {fas.nm_fasilitas}
                                        </option>
                                    ))}
                                </select>
                                {errors.fasilitas_id && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.fasilitas_id.message}</span>
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Gambar */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Gambar <span className="text-error">{selectedGaleri ? '' : '*'}</span>
                                </span>
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
                            {errors.gambar && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.gambar.message}</span>
                                </label>
                            )}
                            {selectedGaleri && !previewImage && (
                                <label className="label">
                                    <span className="label-text-alt text-base-content/50">Kosongkan jika tidak ingin mengubah gambar</span>
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
                                        {selectedGaleri ? 'Menyimpan...' : 'Menambahkan...'}
                                    </>
                                ) : selectedGaleri ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Tambah Galeri'
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
                        setSelectedGaleri(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Galeri"
                    message={`Apakah Anda yakin ingin menghapus galeri ${selectedGaleri?.judul ? `"${selectedGaleri.judul}"` : 'ini'}?`}
                />

                {/* Lightbox */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={galeri.data
                        .filter((item) => item.gambar)
                        .map((item) => ({
                            src: `/storage/${item.gambar}`,
                            alt: item.judul && item.judul !== 'null' ? item.judul : 'Galeri',
                            description: item.desk || undefined,
                        }))}
                    styles={{
                        container: { backgroundColor: 'transparent' },
                        backdrop: {
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        },
                    }}
                />
            </div>
        </AdminLayout>
    );
}
