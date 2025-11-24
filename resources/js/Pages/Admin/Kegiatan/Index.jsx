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
import { SelectChain } from '@/Components/forms';

const kegiatanSchema = yup.object({
    kel_id: yup.string().required('Kelurahan wajib dipilih'),
    nm_kegiatan: yup.string().required('Nama kegiatan wajib diisi').max(255, 'Nama kegiatan maksimal 255 karakter'),
    tgl_kegiatan: yup.date().required('Tanggal kegiatan wajib diisi').typeError('Tanggal kegiatan harus berupa tanggal yang valid'),
    jam_mulai: yup.string().nullable().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam mulai harus HH:mm'),
    jam_seles: yup
        .string()
        .nullable()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam selesai harus HH:mm')
        .test('after-jam-mulai', 'Jam selesai harus setelah jam mulai', function (value) {
            const { jam_mulai } = this.parent;
            if (!value || !jam_mulai) return true;
            const [jamMulaiHours, jamMulaiMinutes] = jam_mulai.split(':').map(Number);
            const [jamSelesHours, jamSelesMinutes] = value.split(':').map(Number);
            const jamMulaiTotal = jamMulaiHours * 60 + jamMulaiMinutes;
            const jamSelesTotal = jamSelesHours * 60 + jamSelesMinutes;
            return jamSelesTotal > jamMulaiTotal;
        }),
    ket: yup.string().nullable(),
    jenis: yup.string().required('Jenis kegiatan wajib dipilih').oneOf(['pembelajaran', 'sosial', 'produktif', 'seni', 'lainnya'], 'Jenis kegiatan tidak valid'),
    status: yup.string().required('Status wajib dipilih').oneOf(['terjadwal', 'berlangsung', 'selesai'], 'Status tidak valid'),
});

const jenisOptions = [
    { value: 'pembelajaran', label: 'Pembelajaran' },
    { value: 'sosial', label: 'Sosial' },
    { value: 'produktif', label: 'Produktif' },
    { value: 'seni', label: 'Seni' },
    { value: 'lainnya', label: 'Lainnya' },
];

const statusOptions = [
    { value: 'terjadwal', label: 'Terjadwal' },
    { value: 'berlangsung', label: 'Berlangsung' },
    { value: 'selesai', label: 'Selesai' },
];

export default function Index({ auth, kegiatan, provinsi, kabKota, kecamatan, kelurahan, jenisList, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);

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
        resolver: yupResolver(kegiatanSchema),
        defaultValues: {
            prov_id: '',
            kab_id: '',
            kec_id: '',
            kel_id: '',
            nm_kegiatan: '',
            tgl_kegiatan: '',
            jam_mulai: '',
            jam_seles: '',
            ket: '',
            jenis: '',
            status: 'terjadwal',
        },
    });

    const formValues = watch();

    const openModal = (kegiatanData = null) => {
        if (kegiatanData) {
            setSelectedKegiatan(kegiatanData);
            // Get prov_id, kab_id, kec_id from relationships
            const kel = kelurahan.find((k) => k.id === kegiatanData.kel_id);
            const kec = kel ? kecamatan.find((k) => k.id === kel.kec_id) : null;
            const kab = kec ? kabKota.find((k) => k.id === kec.kab_id) : null;

            setValue('prov_id', kab ? String(kab.prov_id) : '');
            setValue('kab_id', kec ? String(kec.kab_id) : '');
            setValue('kec_id', kel ? String(kel.kec_id) : '');
            setValue('kel_id', String(kegiatanData.kel_id));
            setValue('nm_kegiatan', kegiatanData.nm_kegiatan);
            setValue('tgl_kegiatan', kegiatanData.tgl_kegiatan ? kegiatanData.tgl_kegiatan.split('T')[0] : '');
            setValue('jam_mulai', kegiatanData.jam_mulai ? kegiatanData.jam_mulai.substring(0, 5) : '');
            setValue('jam_seles', kegiatanData.jam_seles ? kegiatanData.jam_seles.substring(0, 5) : '');
            setValue('ket', kegiatanData.ket || '');
            setValue('jenis', kegiatanData.jenis);
            setValue('status', kegiatanData.status);
        } else {
            setSelectedKegiatan(null);
            reset({
                prov_id: '',
                kab_id: '',
                kec_id: '',
                kel_id: '',
                nm_kegiatan: '',
                tgl_kegiatan: '',
                jam_mulai: '',
                jam_seles: '',
                ket: '',
                jenis: '',
                status: 'terjadwal',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKegiatan(null);
        reset({
            prov_id: '',
            kab_id: '',
            kec_id: '',
            kel_id: '',
            nm_kegiatan: '',
            tgl_kegiatan: '',
            jam_mulai: '',
            jam_seles: '',
            ket: '',
            jenis: '',
            status: 'terjadwal',
        });
    };

    const onSubmit = (data) => {
        const submitData = {
            kel_id: data.kel_id,
            nm_kegiatan: data.nm_kegiatan,
            tgl_kegiatan: data.tgl_kegiatan,
            jam_mulai: data.jam_mulai || null,
            jam_seles: data.jam_seles || null,
            ket: data.ket || null,
            jenis: data.jenis,
            status: data.status,
        };

        if (selectedKegiatan) {
            router.patch(`/admin/kegiatan/${selectedKegiatan.id}`, submitData, {
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
            router.post('/admin/kegiatan', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    reset({
                        prov_id: '',
                        kab_id: '',
                        kec_id: '',
                        kel_id: '',
                        nm_kegiatan: '',
                        tgl_kegiatan: '',
                        jam_mulai: '',
                        jam_seles: '',
                        ket: '',
                        jenis: '',
                        status: 'terjadwal',
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

    const handleDetail = (kegiatanData) => {
        setSelectedKegiatan(kegiatanData);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (kegiatanData) => {
        setSelectedKegiatan(kegiatanData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedKegiatan) {
            router.delete(`/admin/kegiatan/${selectedKegiatan.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedKegiatan(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleSelectChainChange = (name, value) => {
        setValue(name, value);
    };

    const handleFilterJenis = (e) => {
        const jenis = e.target.value;
        router.get(
            '/admin/kegiatan',
            { ...filters, jenis: jenis || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterStatus = (e) => {
        const status = e.target.value;
        router.get(
            '/admin/kegiatan',
            { ...filters, status: status || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Kegiatan" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Kegiatan</h1>
                        <p className="mt-1 text-base-content/70">Kelola data kegiatan program pendidikan</p>
                    </div>
                    <Button onClick={() => openModal()} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kegiatan
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-3">
                            <SearchBox
                                placeholder="Cari kegiatan..."
                                defaultValue={filters?.search || ''}
                                route="/admin/kegiatan"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Jenis</span>
                                </label>
                                <select className="select-bordered select w-full" value={filters?.jenis || ''} onChange={handleFilterJenis}>
                                    <option value="">Semua Jenis</option>
                                    {jenisList.map((jenis) => (
                                        <option key={jenis} value={jenis}>
                                            {jenisOptions.find((opt) => opt.value === jenis)?.label || jenis}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Status</span>
                                </label>
                                <select className="select-bordered select w-full" value={filters?.status || ''} onChange={handleFilterStatus}>
                                    <option value="">Semua Status</option>
                                    {statusOptions.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
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
                                        <th>Nama Kegiatan</th>
                                        <th>Tanggal & Waktu</th>
                                        <th>Jenis</th>
                                        <th>Kelurahan</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kegiatan.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-base-content/70">
                                                Tidak ada data kegiatan
                                            </td>
                                        </tr>
                                    ) : (
                                        kegiatan.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{kegiatan.from + index}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_kegiatan}</div>
                                                    {item.ket && <div className="line-clamp-1 text-sm text-base-content/70">{item.ket}</div>}
                                                </td>
                                                <td>
                                                    <div>{item.tgl_kegiatan ? new Date(item.tgl_kegiatan).toLocaleDateString('id-ID') : '-'}</div>
                                                    {item.jam_mulai && item.jam_seles && (
                                                        <div className="text-sm text-base-content/70">
                                                            {item.jam_mulai.substring(0, 5)} - {item.jam_seles.substring(0, 5)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline">
                                                        {jenisOptions.find((opt) => opt.value === item.jenis)?.label || item.jenis}
                                                    </span>
                                                </td>
                                                <td>{item.kelurahan?.nm_kel || '-'}</td>
                                                <td>
                                                    {item.status === 'terjadwal' && <span className="badge badge-info">Terjadwal</span>}
                                                    {item.status === 'berlangsung' && <span className="badge badge-warning">Berlangsung</span>}
                                                    {item.status === 'selesai' && <span className="badge badge-success">Selesai</span>}
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
                                                        <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete(item)} title="Hapus">
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
                {kegiatan.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="join">
                            {kegiatan.links.map((link, index) => (
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
                    title={selectedKegiatan ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                    size="5xl"
                >
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        {/* SelectChain for Kelurahan */}
                        <SelectChain
                            levels={[
                                {
                                    name: 'prov_id',
                                    label: 'Provinsi',
                                    options: provinsi,
                                    optionValue: 'id',
                                    optionLabel: 'nm_prov',
                                    required: true,
                                },
                                {
                                    name: 'kab_id',
                                    label: 'Kabupaten/Kota',
                                    options: kabKota,
                                    optionValue: 'id',
                                    optionLabel: 'nm_kab',
                                    dependsOn: 'prov_id',
                                    foreignKey: 'prov_id',
                                    required: true,
                                },
                                {
                                    name: 'kec_id',
                                    label: 'Kecamatan',
                                    options: kecamatan,
                                    optionValue: 'id',
                                    optionLabel: 'nm_kec',
                                    dependsOn: 'kab_id',
                                    foreignKey: 'kab_id',
                                    required: true,
                                },
                                {
                                    name: 'kel_id',
                                    label: 'Kelurahan',
                                    options: kelurahan,
                                    optionValue: 'id',
                                    optionLabel: 'nm_kel',
                                    dependsOn: 'kec_id',
                                    foreignKey: 'kec_id',
                                    required: true,
                                },
                            ]}
                            values={formValues}
                            onChange={handleSelectChainChange}
                            errors={errors}
                            gridLayout={[[0, 1], [2, 3]]}
                        />

                        {/* Nama Kegiatan */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Nama Kegiatan <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input-bordered input w-full ${errors.nm_kegiatan ? 'input-error' : ''}`}
                                {...register('nm_kegiatan')}
                                placeholder="Masukkan nama kegiatan"
                            />
                            {errors.nm_kegiatan && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.nm_kegiatan.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 1: Tanggal Kegiatan + Jenis */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Tanggal Kegiatan <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-bordered input w-full ${errors.tgl_kegiatan ? 'input-error' : ''}`}
                                    {...register('tgl_kegiatan')}
                                />
                                {errors.tgl_kegiatan && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tgl_kegiatan.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Jenis Kegiatan <span className="text-error">*</span>
                                    </span>
                                </label>
                                <select className={`select-bordered select w-full ${errors.jenis ? 'select-error' : ''}`} {...register('jenis')}>
                                    <option value="">Pilih Jenis Kegiatan</option>
                                    {jenisOptions.map((jenis) => (
                                        <option key={jenis.value} value={jenis.value}>
                                            {jenis.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.jenis && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.jenis.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Jam Mulai + Jam Selesai */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Jam Mulai (Opsional)</span>
                                </label>
                                <input
                                    type="time"
                                    className={`input-bordered input w-full ${errors.jam_mulai ? 'input-error' : ''}`}
                                    {...register('jam_mulai')}
                                />
                                {errors.jam_mulai && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.jam_mulai.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Jam Selesai (Opsional)</span>
                                </label>
                                <input
                                    type="time"
                                    className={`input-bordered input w-full ${errors.jam_seles ? 'input-error' : ''}`}
                                    {...register('jam_seles')}
                                />
                                {errors.jam_seles && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.jam_seles.message}</span>
                                    </label>
                                )}
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
                                placeholder="Masukkan keterangan kegiatan"
                                rows="4"
                            />
                            {errors.ket && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.ket.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Status */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Status <span className="text-error">*</span>
                                </span>
                            </label>
                            <select className={`select-bordered select w-full ${errors.status ? 'select-error' : ''}`} {...register('status')}>
                                <option value="">Pilih Status</option>
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.status.message}</span>
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
                                        {selectedKegiatan ? 'Menyimpan...' : 'Menambahkan...'}
                                    </>
                                ) : selectedKegiatan ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Tambah Kegiatan'
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
                        setSelectedKegiatan(null);
                    }}
                    title="Detail Kegiatan"
                    size="4xl"
                >
                    {selectedKegiatan && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="flex items-center gap-4 pb-4 border-b border-base-300">
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-16">
                                        <span className="text-2xl">{selectedKegiatan.nm_kegiatan?.charAt(0).toUpperCase() || 'K'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedKegiatan.nm_kegiatan}</h3>
                                    <p className="text-sm text-base-content/70">
                                        {selectedKegiatan.tgl_kegiatan
                                            ? new Date(selectedKegiatan.tgl_kegiatan).toLocaleDateString('id-ID', {
                                                  weekday: 'long',
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Data Kegiatan */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Kolom 1 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Jenis Kegiatan</label>
                                        <p className="mt-1">
                                            <span className="badge badge-outline badge-lg">
                                                {jenisOptions.find((opt) => opt.value === selectedKegiatan.jenis)?.label || selectedKegiatan.jenis}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Waktu Kegiatan</label>
                                        <p className="mt-1">
                                            {selectedKegiatan.jam_mulai && selectedKegiatan.jam_seles
                                                ? `${selectedKegiatan.jam_mulai.substring(0, 5)} - ${selectedKegiatan.jam_seles.substring(0, 5)}`
                                                : selectedKegiatan.jam_mulai
                                                  ? `Mulai: ${selectedKegiatan.jam_mulai.substring(0, 5)}`
                                                  : '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Status</label>
                                        <p className="mt-1">
                                            {selectedKegiatan.status === 'terjadwal' && <span className="badge badge-info badge-lg">Terjadwal</span>}
                                            {selectedKegiatan.status === 'berlangsung' && <span className="badge badge-warning badge-lg">Berlangsung</span>}
                                            {selectedKegiatan.status === 'selesai' && <span className="badge badge-success badge-lg">Selesai</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom 2 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Kelurahan</label>
                                        <p className="mt-1">
                                            {selectedKegiatan.kelurahan?.nm_kel || '-'}
                                            {selectedKegiatan.kelurahan?.kecamatan && (
                                                <span className="text-sm text-base-content/70">
                                                    {selectedKegiatan.kelurahan.nm_kel ? ', ' : ''}
                                                    {selectedKegiatan.kelurahan.kecamatan.nm_kec}
                                                    {selectedKegiatan.kelurahan.kecamatan.kab_kota && (
                                                        <>
                                                            , {selectedKegiatan.kelurahan.kecamatan.kab_kota.nm_kab}
                                                            {selectedKegiatan.kelurahan.kecamatan.kab_kota.provinsi && (
                                                                <>
                                                                    , {selectedKegiatan.kelurahan.kecamatan.kab_kota.provinsi.nm_prov}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {selectedKegiatan.ket && (
                                        <div>
                                            <label className="text-sm font-semibold text-base-content/70">Keterangan</label>
                                            <p className="mt-1 whitespace-pre-wrap">{selectedKegiatan.ket}</p>
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
                                        openModal(selectedKegiatan);
                                    }}
                                    className="btn-primary"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Kegiatan
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        setSelectedKegiatan(null);
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
                        setSelectedKegiatan(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Kegiatan"
                    message={`Apakah Anda yakin ingin menghapus kegiatan "${selectedKegiatan?.nm_kegiatan}"?`}
                />
            </div>
        </AdminLayout>
    );
}

