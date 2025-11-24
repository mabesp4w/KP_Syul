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

const kelurahanSchema = z.object({
    kec_id: z.string().min(1, 'Kecamatan wajib dipilih'),
    nm_kel: z.string().min(1, 'Nama kelurahan wajib diisi').max(255, 'Nama kelurahan maksimal 255 karakter'),
});

export default function Index({ auth, kelurahan, provinsi, kabKota, kecamatan, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedKelurahan, setSelectedKelurahan] = useState(null);

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
        kec_id: '',
        nm_kel: '',
    });

    // Show toast from flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openModal = (kelurahanData = null) => {
        if (kelurahanData) {
            setSelectedKelurahan(kelurahanData);
            // Get prov_id and kab_id from relationships
            const kec = kecamatan.find((k) => k.id === kelurahanData.kec_id);
            const kab = kec ? kabKota.find((k) => k.id === kec.kab_id) : null;
            setData({
                prov_id: kab ? String(kab.prov_id) : '',
                kab_id: kec ? String(kec.kab_id) : '',
                kec_id: String(kelurahanData.kec_id),
                nm_kel: kelurahanData.nm_kel,
            });
        } else {
            setSelectedKelurahan(null);
            setData({
                prov_id: '',
                kab_id: '',
                kec_id: filters?.kec_id || '',
                nm_kel: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKelurahan(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate with Zod
        const submitData = {
            kec_id: data.kec_id,
            nm_kel: data.nm_kel,
        };

        const validation = kelurahanSchema.safeParse(submitData);
        if (!validation.success) {
            return;
        }

        if (selectedKelurahan) {
            // Menggunakan router.patch untuk update
            router.patch(`/admin/kelurahan/${selectedKelurahan.id}`, submitData, {
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
            router.post('/admin/kelurahan', submitData, {
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

    const handleDelete = (kelurahanData) => {
        setSelectedKelurahan(kelurahanData);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedKelurahan) {
            // Menggunakan router.delete untuk destroy
            router.delete(`/admin/kelurahan/${selectedKelurahan.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedKelurahan(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleFilterKecamatan = (e) => {
        const kecId = e.target.value;
        router.get(
            '/admin/kelurahan',
            { ...filters, kec_id: kecId || null },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Filter kecamatan based on selected kab_id for SelectChain
    const filteredKecamatan = data.kab_id
        ? kecamatan.filter((kec) => String(kec.kab_id) === String(data.kab_id))
        : [];

    // Clear kec_id when kab_id changes
    useEffect(() => {
        if (data.kab_id && data.kec_id) {
            const isValidKec = filteredKecamatan.some((kec) => String(kec.id) === String(data.kec_id));
            if (!isValidKec) {
                setData('kec_id', '');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.kab_id]);

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Kelurahan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-aos="fade-down">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Kelurahan</h1>
                        <p className="text-base-content/70 mt-1">Kelola data kelurahan di Indonesia</p>
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
                        Tambah Kelurahan
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-100 shadow-sm" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari kelurahan, kecamatan, kabupaten/kota, atau provinsi..."
                                defaultValue={filters?.search || ''}
                                route="/admin/kelurahan"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Kecamatan</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters?.kec_id || ''}
                                    onChange={handleFilterKecamatan}
                                >
                                    <option value="">Semua Kecamatan</option>
                                    {kecamatan.map((kec) => (
                                        <option key={kec.id} value={kec.id}>
                                            {kec.nm_kec} - {kec.kab_kota?.nm_kab} - {kec.kab_kota?.provinsi?.nm_prov}
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
                                        <th>Nama Kelurahan</th>
                                        <th>Kecamatan</th>
                                        <th>Kabupaten/Kota</th>
                                        <th>Provinsi</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kelurahan.data.length > 0 ? (
                                        kelurahan.data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{kelurahan.from + index}</td>
                                                <td>
                                                    <div className="font-medium">{item.nm_kel}</div>
                                                </td>
                                                <td>
                                                    <div className="text-sm text-base-content/70">
                                                        {item.kecamatan?.nm_kec || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-sm text-base-content/70">
                                                        {item.kecamatan?.kab_kota?.nm_kab || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-sm text-base-content/50">
                                                        {item.kecamatan?.kab_kota?.provinsi?.nm_prov || '-'}
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
                                            <td colSpan="6" className="text-center py-8 text-base-content/50">
                                                <p>Tidak ada data kelurahan</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {kelurahan.links && kelurahan.links.length > 3 && (
                            <div className="card-body border-t border-base-300">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-sm text-base-content/70">
                                        Menampilkan {kelurahan.from} sampai {kelurahan.to} dari {kelurahan.total} data
                                    </div>
                                    <div className="join">
                                        {kelurahan.links.map((link, index) => (
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
                id="kelurahan-modal"
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedKelurahan ? 'Ubah Kelurahan' : 'Tambah Kelurahan'}
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
                            {selectedKelurahan ? 'Simpan Perubahan' : 'Tambah'}
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
                            {
                                name: 'kec_id',
                                label: 'Kecamatan',
                                options: filteredKecamatan,
                                optionValue: 'id',
                                optionLabel: (kec) => `${kec.nm_kec} - ${kec.kab_kota?.nm_kab || ''}`,
                                dependsOn: 'kab_id',
                                filterFn: (kec, kabId) => String(kec.kab_id) === String(kabId),
                                required: true,
                                placeholder: 'Pilih Kecamatan',
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
                                Nama Kelurahan <span className="text-error">*</span>
                            </span>
                        </label>
                        <input
                            type="text"
                            className={`input input-bordered w-full ${errors.nm_kel ? 'input-error' : ''}`}
                            placeholder="Masukkan nama kelurahan"
                            value={data.nm_kel}
                            onChange={(e) => setData('nm_kel', e.target.value)}
                            disabled={processing}
                        />
                        {errors.nm_kel && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.nm_kel}</span>
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
                    setSelectedKelurahan(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Kelurahan"
                message={`Apakah Anda yakin ingin menghapus "${selectedKelurahan?.nm_kel}"?`}
                confirmText="Hapus"
                cancelText="Batal"
                variant="error"
            />
        </AdminLayout>
    );
}

