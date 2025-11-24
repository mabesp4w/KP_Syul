import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import SearchBox from '@/Components/ui/SearchBox';
import Button from '@/Components/ui/Button';

export default function Index({ auth, programPendidikan, kategori, filters }) {
    const handleFilterKategori = (e) => {
        router.get(
            '/program-pendidikan',
            { ...filters, kat: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Program Pendidikan" />
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8 text-center" data-aos="fade-down">
                    <h1 className="text-4xl font-bold text-base-content">Program Pendidikan</h1>
                    <p className="mt-2 text-lg text-base-content/70">Program pendidikan yang tersedia untuk Anda</p>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-200 shadow-sm mb-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari program..."
                                defaultValue={filters?.search || ''}
                                route="/program-pendidikan"
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
                                    {kategori.map((kat) => (
                                        <option key={kat} value={kat}>
                                            {kat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Program Grid */}
                {programPendidikan.data.length === 0 ? (
                    <div className="text-center py-12" data-aos="fade-up">
                        <p className="text-base-content/70">Tidak ada program ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {programPendidikan.data.map((program, index) => (
                            <Link key={program.id} href={`/program-pendidikan/${program.slug}`}>
                                <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="card-body">
                                        <div className="badge badge-primary badge-sm mb-2">{program.kat}</div>
                                        <h3 className="card-title text-lg">{program.nm_prog}</h3>
                                        <p className="text-sm text-base-content/70 line-clamp-3 mt-2">{program.desk}</p>
                                        <div className="space-y-1 text-sm text-base-content/70 mt-4">
                                            {program.tgt_pst && (
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
                                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        />
                                                    </svg>
                                                    <span>Target: {program.tgt_pst}</span>
                                                </div>
                                            )}
                                            {program.durasi && (
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
                                                    <span>Durasi: {program.durasi}</span>
                                                </div>
                                            )}
                                            {program.biaya !== null && (
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
                                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span>
                                                        Biaya: {program.biaya ? `Rp ${program.biaya.toLocaleString('id-ID')}` : 'Gratis'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
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
                {programPendidikan.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up">
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
            </div>
        </UserLayout>
    );
}

