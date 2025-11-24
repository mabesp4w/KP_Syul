import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import SearchBox from '@/Components/ui/SearchBox';
import Button from '@/Components/ui/Button';

export default function Index({ auth, berita, kategori, filters }) {
    const kategoriOptions = {
        pengumuman: 'Pengumuman',
        acara: 'Acara',
        prestasi: 'Prestasi',
        info_umum: 'Info Umum',
    };

    // Helper function to strip HTML and get plain text preview
    const getTextPreview = (html, maxLength = 150) => {
        if (!html) return '';
        // Remove HTML tags using regex
        const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleFilterKategori = (e) => {
        router.get(
            '/berita',
            { ...filters, kat: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Berita & Pengumuman">
                <meta name="description" content="Berita dan pengumuman terbaru dari PKBM Dabohaley. Informasi terkini tentang kegiatan, program pendidikan, dan pengumuman penting. Dikelola oleh Syull Wally." />
                <meta name="author" content="Syull Wally" />
                <meta name="keywords" content="berita PKBM Dabohaley, pengumuman pendidikan, Syull Wally, kegiatan belajar masyarakat, informasi pendidikan" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Berita & Pengumuman - PKBM Dabohaley" />
                <meta property="og:description" content="Berita dan pengumuman terbaru dari PKBM Dabohaley. Informasi terkini tentang kegiatan dan program pendidikan." />
                <meta property="og:type" content="website" />
            </Head>
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8 text-center" data-aos="fade-down">
                    <h1 className="text-4xl font-bold text-base-content">Berita & Pengumuman</h1>
                    <p className="mt-2 text-lg text-base-content/70">Informasi dan pengumuman terbaru untuk Anda</p>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-200 shadow-sm mb-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari berita..."
                                defaultValue={filters?.search || ''}
                                route="/berita"
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
                                            {kategoriOptions[kat] || kat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Berita Grid */}
                {berita.data.length === 0 ? (
                    <div className="text-center py-12" data-aos="fade-up">
                        <p className="text-base-content/70">Tidak ada berita ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {berita.data.map((item, index) => (
                            <Link key={item.id} href={`/berita/${item.slug}`}>
                                <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full" data-aos="fade-up" data-aos-delay={index * 100}>
                                    {item.foto_utama && (
                                        <figure className="aspect-video">
                                            <img
                                                src={`/storage/${item.foto_utama}`}
                                                alt={item.judul}
                                                className="h-full w-full object-cover"
                                            />
                                        </figure>
                                    )}
                                    <div className="card-body">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="badge badge-primary badge-sm">
                                                {kategoriOptions[item.kat] || item.kat}
                                            </span>
                                            <span className="text-xs text-base-content/50">
                                                {new Date(item.tgl_pub).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <h3 className="card-title text-lg line-clamp-2">{item.judul}</h3>
                                        <p className="text-sm text-base-content/70 line-clamp-3">
                                            {getTextPreview(item.isi, 150)}
                                        </p>
                                        <div className="card-actions mt-4">
                                            <Button variant="ghost" size="sm" className="w-full">
                                                Baca Selengkapnya →
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {berita.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up">
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
            </div>
        </UserLayout>
    );
}

