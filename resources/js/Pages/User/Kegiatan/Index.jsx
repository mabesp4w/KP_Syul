import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import SearchBox from '@/Components/ui/SearchBox';
import Button from '@/Components/ui/Button';

export default function Index({ auth, kegiatan, jenisList, filters }) {
    const jenisOptions = {
        pembelajaran: 'Pembelajaran',
        sosial: 'Sosial',
        produktif: 'Produktif',
        seni: 'Seni',
        lainnya: 'Lainnya',
    };

    const statusOptions = {
        terjadwal: 'Terjadwal',
        berlangsung: 'Berlangsung',
        selesai: 'Selesai',
    };

    const handleFilterJenis = (e) => {
        router.get(
            '/kegiatan',
            { ...filters, jenis: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    const handleFilterStatus = (e) => {
        router.get(
            '/kegiatan',
            { ...filters, status: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Kegiatan" />
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8 text-center" data-aos="fade-down">
                    <h1 className="text-4xl font-bold text-base-content">Kegiatan</h1>
                    <p className="mt-2 text-lg text-base-content/70">Kegiatan yang akan datang dan sedang berlangsung</p>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-200 shadow-sm mb-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-3">
                            <SearchBox
                                placeholder="Cari kegiatan..."
                                defaultValue={filters?.search || ''}
                                route="/kegiatan"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Jenis</span>
                                </label>
                                <select
                                    className="select-bordered select w-full"
                                    value={filters?.jenis || ''}
                                    onChange={handleFilterJenis}
                                >
                                    <option value="">Semua Jenis</option>
                                    {jenisList.map((jenis) => (
                                        <option key={jenis} value={jenis}>
                                            {jenisOptions[jenis] || jenis}
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
                                    value={filters?.status || ''}
                                    onChange={handleFilterStatus}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="terjadwal">Terjadwal</option>
                                    <option value="berlangsung">Berlangsung</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kegiatan Grid */}
                {kegiatan.data.length === 0 ? (
                    <div className="text-center py-12" data-aos="fade-up">
                        <p className="text-base-content/70">Tidak ada kegiatan ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {kegiatan.data.map((item, index) => (
                            <Link key={item.id} href={`/kegiatan/${item.slug}`}>
                                <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="card-body">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="badge badge-secondary badge-sm">{jenisOptions[item.jenis] || item.jenis}</span>
                                            <span className="badge badge-outline badge-sm">{statusOptions[item.status] || item.status}</span>
                                        </div>
                                        <h3 className="card-title text-lg">{item.nm_kegiatan}</h3>
                                        <div className="space-y-1 text-sm text-base-content/70 mt-2">
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
                                                <span>{new Date(item.tgl_kegiatan).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            {item.jam_mulai && (
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
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span>
                                                        {item.jam_mulai}
                                                        {item.jam_seles && ` - ${item.jam_seles}`}
                                                    </span>
                                                </div>
                                            )}
                                            {item.kelurahan && (
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
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="line-clamp-1">
                                                        {item.kelurahan?.nm_kel}, {item.kelurahan?.kecamatan?.nm_kec}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {item.ket && <p className="text-sm text-base-content/70 line-clamp-2 mt-2">{item.ket}</p>}
                                        <div className="card-actions mt-4">
                                            <Button variant="primary" size="sm" className="w-full">
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {kegiatan.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up">
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
            </div>
        </UserLayout>
    );
}

