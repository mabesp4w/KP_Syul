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

const pesertaSchema = yup.object({
    kel_id: yup.string().required('Kelurahan wajib dipilih'),
    prog_id: yup.string().required('Program pendidikan wajib dipilih'),
    no_induk: yup.string().required('Nomor induk wajib diisi').max(255, 'Nomor induk maksimal 255 karakter'),
    nm_lengkap: yup.string().required('Nama lengkap wajib diisi').max(255, 'Nama lengkap maksimal 255 karakter'),
    tmp_lhr: yup.string().required('Tempat lahir wajib diisi').max(255, 'Tempat lahir maksimal 255 karakter'),
    tgl_lhr: yup.date().required('Tanggal lahir wajib diisi').typeError('Tanggal lahir harus berupa tanggal yang valid'),
    jk: yup.string().required('Jenis kelamin wajib dipilih').oneOf(['L', 'P'], 'Jenis kelamin harus Laki-laki atau Perempuan'),
    alamat: yup.string().required('Alamat wajib diisi'),
    no_tlp: yup.string().required('Nomor telepon wajib diisi').max(255, 'Nomor telepon maksimal 255 karakter'),
    email: yup.string().nullable().email('Email harus berupa format email yang valid').max(255, 'Email maksimal 255 karakter'),
    nm_wali: yup.string().nullable().max(255, 'Nama wali maksimal 255 karakter'),
    tlp_wali: yup.string().nullable().max(255, 'Telepon wali maksimal 255 karakter'),
    tgl_dftr: yup.date().required('Tanggal daftar wajib diisi').typeError('Tanggal daftar harus berupa tanggal yang valid'),
    status: yup.string().required('Status wajib dipilih').oneOf(['aktif', 'lulus', 'tidak_aktif', 'cuti'], 'Status tidak valid'),
});

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'tidak_aktif', label: 'Tidak Aktif' },
    { value: 'cuti', label: 'Cuti' },
];

export default function Index({ auth, peserta, programPendidikan, provinsi, kabKota, kecamatan, kelurahan, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState(null);

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
        resolver: yupResolver(pesertaSchema),
        defaultValues: {
            prov_id: '',
            kab_id: '',
            kec_id: '',
            kel_id: '',
            prog_id: '',
            no_induk: '',
            nm_lengkap: '',
            tmp_lhr: '',
            tgl_lhr: '',
            jk: '',
            alamat: '',
            no_tlp: '',
            email: '',
            nm_wali: '',
            tlp_wali: '',
            tgl_dftr: new Date().toISOString().split('T')[0], // Default to today
            status: 'aktif',
        },
    });

    const formValues = watch();

    const openModal = (pesertaData = null) => {
        if (pesertaData) {
            setSelectedPeserta(pesertaData);
            // Get prov_id, kab_id, kec_id from relationships
            const kel = kelurahan.find((k) => k.id === pesertaData.kel_id);
            const kec = kel ? kecamatan.find((k) => k.id === kel.kec_id) : null;
            const kab = kec ? kabKota.find((k) => k.id === kec.kab_id) : null;
            
            setValue('prov_id', kab ? String(kab.prov_id) : '');
            setValue('kab_id', kec ? String(kec.kab_id) : '');
            setValue('kec_id', kel ? String(kel.kec_id) : '');
            setValue('kel_id', String(pesertaData.kel_id));
            setValue('prog_id', String(pesertaData.prog_id));
            setValue('no_induk', pesertaData.no_induk);
            setValue('nm_lengkap', pesertaData.nm_lengkap);
            setValue('tmp_lhr', pesertaData.tmp_lhr);
            setValue('tgl_lhr', pesertaData.tgl_lhr ? pesertaData.tgl_lhr.split('T')[0] : '');
            setValue('jk', pesertaData.jk);
            setValue('alamat', pesertaData.alamat);
            setValue('no_tlp', pesertaData.no_tlp);
            setValue('email', pesertaData.email || '');
            setValue('nm_wali', pesertaData.nm_wali || '');
            setValue('tlp_wali', pesertaData.tlp_wali || '');
            setValue('tgl_dftr', pesertaData.tgl_dftr ? pesertaData.tgl_dftr.split('T')[0] : '');
            setValue('status', pesertaData.status);
        } else {
            setSelectedPeserta(null);
            reset({
                prov_id: '',
                kab_id: '',
                kec_id: '',
                kel_id: '',
                prog_id: '',
                no_induk: '',
                nm_lengkap: '',
                tmp_lhr: '',
                tgl_lhr: '',
                jk: '',
                alamat: '',
                no_tlp: '',
                email: '',
                nm_wali: '',
                tlp_wali: '',
                tgl_dftr: new Date().toISOString().split('T')[0],
                status: 'aktif',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPeserta(null);
        reset({
            prov_id: '',
            kab_id: '',
            kec_id: '',
            kel_id: '',
            prog_id: '',
            no_induk: '',
            nm_lengkap: '',
            tmp_lhr: '',
            tgl_lhr: '',
            jk: '',
            alamat: '',
            no_tlp: '',
            email: '',
            nm_wali: '',
            tlp_wali: '',
            tgl_dftr: new Date().toISOString().split('T')[0],
            status: 'aktif',
        });
    };

    const onSubmit = (data) => {
        const submitData = {
            kel_id: data.kel_id,
            prog_id: data.prog_id,
            no_induk: data.no_induk,
            nm_lengkap: data.nm_lengkap,
            tmp_lhr: data.tmp_lhr,
            tgl_lhr: data.tgl_lhr,
            jk: data.jk,
            alamat: data.alamat,
            no_tlp: data.no_tlp,
            email: data.email || null,
            nm_wali: data.nm_wali || null,
            tlp_wali: data.tlp_wali || null,
            tgl_dftr: data.tgl_dftr,
            status: data.status,
        };

        if (selectedPeserta) {
            router.patch(`/admin/peserta/${selectedPeserta.id}`, submitData, {
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
            router.post('/admin/peserta', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    reset({
                        prov_id: '',
                        kab_id: '',
                        kec_id: '',
                        kel_id: '',
                        prog_id: '',
                        no_induk: '',
                        nm_lengkap: '',
                        tmp_lhr: '',
                        tgl_lhr: '',
                        jk: '',
                        alamat: '',
                        no_tlp: '',
                        email: '',
                        nm_wali: '',
                        tlp_wali: '',
                        tgl_dftr: new Date().toISOString().split('T')[0],
                        status: 'aktif',
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

    const handleDetail = (pesertaData) => {
        setSelectedPeserta(pesertaData);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (pesertaData) => {
        setSelectedPeserta(pesertaData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedPeserta) {
            router.delete(`/admin/peserta/${selectedPeserta.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedPeserta(null);
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

    const handleFilterProgram = (e) => {
        const progId = e.target.value;
        router.get(
            '/admin/peserta',
            { ...filters, prog_id: progId || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterStatus = (e) => {
        const status = e.target.value;
        router.get(
            '/admin/peserta',
            { ...filters, status: status || null },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Peserta" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Peserta</h1>
                        <p className="mt-1 text-base-content/70">Kelola data peserta program pendidikan</p>
                    </div>
                    <Button onClick={() => openModal()} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Peserta
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-3">
                            <SearchBox
                                placeholder="Cari peserta..."
                                defaultValue={filters?.search || ''}
                                route="/admin/peserta"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Program</span>
                                </label>
                                <select className="select-bordered select w-full" value={filters?.prog_id || ''} onChange={handleFilterProgram}>
                                    <option value="">Semua Program</option>
                                    {programPendidikan.map((prog) => (
                                        <option key={prog.id} value={prog.id}>
                                            {prog.nm_prog}
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
                                        <th>Nomor Induk</th>
                                        <th>Nama Lengkap</th>
                                        <th>Program</th>
                                        <th>Kelurahan</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {peserta.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-base-content/70">
                                                Tidak ada data peserta
                                            </td>
                                        </tr>
                                    ) : (
                                        peserta.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{peserta.from + index}</td>
                                                <td className="font-medium">{item.no_induk}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_lengkap}</div>
                                                    <div className="text-sm text-base-content/70">
                                                        {item.tmp_lhr}, {item.tgl_lhr ? new Date(item.tgl_lhr).toLocaleDateString('id-ID') : '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-outline">{item.program_pendidikan?.nm_prog || '-'}</span>
                                                </td>
                                                <td>{item.kelurahan?.nm_kel || '-'}</td>
                                                <td>
                                                    {item.status === 'aktif' && <span className="badge badge-success">Aktif</span>}
                                                    {item.status === 'lulus' && <span className="badge badge-info">Lulus</span>}
                                                    {item.status === 'tidak_aktif' && <span className="badge badge-error">Tidak Aktif</span>}
                                                    {item.status === 'cuti' && <span className="badge badge-warning">Cuti</span>}
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
                {peserta.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="join">
                            {peserta.links.map((link, index) => (
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
                    title={selectedPeserta ? 'Edit Peserta' : 'Tambah Peserta'}
                    size="5xl"
                >
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        {/* SelectChain for Kelurahan - Provinsi & Kabupaten/Kota in one row, Kecamatan & Kelurahan in one row */}
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
                            gridLayout={[[0, 1], [2, 3]]} // First row: provinsi & kabupaten, Second row: kecamatan & kelurahan
                        />

                        {/* Program Pendidikan */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Program Pendidikan <span className="text-error">*</span>
                                </span>
                            </label>
                            <select className={`select-bordered select w-full ${errors.prog_id ? 'select-error' : ''}`} {...register('prog_id')}>
                                <option value="">Pilih Program Pendidikan</option>
                                {programPendidikan.map((prog) => (
                                    <option key={prog.id} value={prog.id}>
                                        {prog.nm_prog}
                                    </option>
                                ))}
                            </select>
                            {errors.prog_id && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.prog_id.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 1: Nomor Induk + Nama Lengkap */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Nomor Induk <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.no_induk ? 'input-error' : ''}`}
                                    {...register('no_induk')}
                                    placeholder="Masukkan nomor induk"
                                />
                                {errors.no_induk && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.no_induk.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Nama Lengkap <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.nm_lengkap ? 'input-error' : ''}`}
                                    {...register('nm_lengkap')}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.nm_lengkap && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.nm_lengkap.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Tempat Lahir + Tanggal Lahir + Jenis Kelamin */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Tempat Lahir <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.tmp_lhr ? 'input-error' : ''}`}
                                    {...register('tmp_lhr')}
                                    placeholder="Masukkan tempat lahir"
                                />
                                {errors.tmp_lhr && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tmp_lhr.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Tanggal Lahir <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-bordered input w-full ${errors.tgl_lhr ? 'input-error' : ''}`}
                                    {...register('tgl_lhr')}
                                />
                                {errors.tgl_lhr && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tgl_lhr.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Jenis Kelamin <span className="text-error">*</span>
                                    </span>
                                </label>
                                <select className={`select-bordered select w-full ${errors.jk ? 'select-error' : ''}`} {...register('jk')}>
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.jk && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.jk.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Alamat <span className="text-error">*</span>
                                </span>
                            </label>
                            <textarea
                                className={`textarea-bordered textarea w-full ${errors.alamat ? 'textarea-error' : ''}`}
                                {...register('alamat')}
                                placeholder="Masukkan alamat lengkap"
                                rows="3"
                            />
                            {errors.alamat && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.alamat.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Row 3: Nomor Telepon + Email */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Nomor Telepon <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.no_tlp ? 'input-error' : ''}`}
                                    {...register('no_tlp')}
                                    placeholder="Masukkan nomor telepon"
                                />
                                {errors.no_tlp && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.no_tlp.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email (Opsional)</span>
                                </label>
                                <input
                                    type="email"
                                    className={`input-bordered input w-full ${errors.email ? 'input-error' : ''}`}
                                    {...register('email')}
                                    placeholder="Masukkan email"
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.email.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Row 4: Nama Wali + Telepon Wali */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nama Wali (Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.nm_wali ? 'input-error' : ''}`}
                                    {...register('nm_wali')}
                                    placeholder="Masukkan nama wali"
                                />
                                {errors.nm_wali && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.nm_wali.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Telepon Wali (Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    className={`input-bordered input w-full ${errors.tlp_wali ? 'input-error' : ''}`}
                                    {...register('tlp_wali')}
                                    placeholder="Masukkan telepon wali"
                                />
                                {errors.tlp_wali && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tlp_wali.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Row 5: Tanggal Daftar + Status */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Tanggal Daftar <span className="text-error">*</span>
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className={`input-bordered input w-full ${errors.tgl_dftr ? 'input-error' : ''}`}
                                    {...register('tgl_dftr')}
                                />
                                {errors.tgl_dftr && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.tgl_dftr.message}</span>
                                    </label>
                                )}
                            </div>

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
                        </div>

                        <div className="modal-action">
                            <Button type="button" onClick={closeModal} className="btn-ghost">
                                Batal
                            </Button>
                            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-sm loading-spinner"></span>
                                        {selectedPeserta ? 'Menyimpan...' : 'Menambahkan...'}
                                    </>
                                ) : selectedPeserta ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Tambah Peserta'
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
                        setSelectedPeserta(null);
                    }}
                    title="Detail Peserta"
                    size="4xl"
                >
                    {selectedPeserta && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="flex items-center gap-4 pb-4 border-b border-base-300">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-16">
                                        <span className="text-2xl">{selectedPeserta.nm_lengkap?.charAt(0).toUpperCase() || 'P'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedPeserta.nm_lengkap}</h3>
                                    <p className="text-sm text-base-content/70">Nomor Induk: {selectedPeserta.no_induk}</p>
                                </div>
                            </div>

                            {/* Data Peserta */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Kolom 1 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Program Pendidikan</label>
                                        <p className="mt-1">
                                            <span className="badge badge-outline badge-lg">
                                                {selectedPeserta.program_pendidikan?.nm_prog || '-'}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Tempat & Tanggal Lahir</label>
                                        <p className="mt-1">
                                            {selectedPeserta.tmp_lhr}, {selectedPeserta.tgl_lhr ? new Date(selectedPeserta.tgl_lhr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Jenis Kelamin</label>
                                        <p className="mt-1">
                                            {selectedPeserta.jk === 'L' ? 'Laki-laki' : selectedPeserta.jk === 'P' ? 'Perempuan' : '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Alamat</label>
                                        <p className="mt-1">{selectedPeserta.alamat || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Alamat Lengkap</label>
                                        <p className="mt-1">{selectedPeserta.alamat || '-'}</p>
                                        <p className="mt-2 text-sm text-base-content/70">
                                            {selectedPeserta.kelurahan?.nm_kel || ''}
                                            {selectedPeserta.kelurahan?.kecamatan && (
                                                <>
                                                    {selectedPeserta.kelurahan.nm_kel ? ', ' : ''}
                                                    {selectedPeserta.kelurahan.kecamatan.nm_kec}
                                                    {selectedPeserta.kelurahan.kecamatan.kab_kota && (
                                                        <>
                                                            , {selectedPeserta.kelurahan.kecamatan.kab_kota.nm_kab}
                                                            {selectedPeserta.kelurahan.kecamatan.kab_kota.provinsi && (
                                                                <>
                                                                    , {selectedPeserta.kelurahan.kecamatan.kab_kota.provinsi.nm_prov}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Kolom 2 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Status</label>
                                        <p className="mt-1">
                                            {selectedPeserta.status === 'aktif' && <span className="badge badge-success badge-lg">Aktif</span>}
                                            {selectedPeserta.status === 'lulus' && <span className="badge badge-info badge-lg">Lulus</span>}
                                            {selectedPeserta.status === 'tidak_aktif' && <span className="badge badge-error badge-lg">Tidak Aktif</span>}
                                            {selectedPeserta.status === 'cuti' && <span className="badge badge-warning badge-lg">Cuti</span>}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Tanggal Daftar</label>
                                        <p className="mt-1">
                                            {selectedPeserta.tgl_dftr
                                                ? new Date(selectedPeserta.tgl_dftr).toLocaleDateString('id-ID', {
                                                      weekday: 'long',
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                  })
                                                : '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Nomor Telepon</label>
                                        <p className="mt-1">{selectedPeserta.no_tlp || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-base-content/70">Email</label>
                                        <p className="mt-1">{selectedPeserta.email || '-'}</p>
                                    </div>

                                    {selectedPeserta.nm_wali && (
                                        <div>
                                            <label className="text-sm font-semibold text-base-content/70">Nama Wali</label>
                                            <p className="mt-1">{selectedPeserta.nm_wali}</p>
                                        </div>
                                    )}

                                    {selectedPeserta.tlp_wali && (
                                        <div>
                                            <label className="text-sm font-semibold text-base-content/70">Telepon Wali</label>
                                            <p className="mt-1">{selectedPeserta.tlp_wali}</p>
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
                                        openModal(selectedPeserta);
                                    }}
                                    className="btn-primary"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Peserta
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        setSelectedPeserta(null);
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
                        setSelectedPeserta(null);
                    }}
                    onConfirm={confirmDelete}
                    title="Hapus Peserta"
                    message={`Apakah Anda yakin ingin menghapus peserta "${selectedPeserta?.nm_lengkap}"?`}
                />
            </div>
        </AdminLayout>
    );
}

