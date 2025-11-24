import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';

export default function Show({ auth, kegiatan, kegiatanTerkait }) {
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

    return (
        <UserLayout auth={auth}>
            <Head title={kegiatan.nm_kegiatan} />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="text-sm breadcrumbs mb-6" data-aos="fade-down">
                        <ul>
                            <li>
                                <Link href="/">Beranda</Link>
                            </li>
                            <li>
                                <Link href="/kegiatan">Kegiatan</Link>
                            </li>
                            <li>{kegiatan.nm_kegiatan}</li>
                        </ul>
                    </div>

                    {/* Article */}
                    <article className="card bg-base-100 shadow-lg" data-aos="fade-up">
                        <div className="card-body">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="badge badge-secondary">{jenisOptions[kegiatan.jenis] || kegiatan.jenis}</span>
                                <span className="badge badge-outline">{statusOptions[kegiatan.status] || kegiatan.status}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{kegiatan.nm_kegiatan}</h1>
                            <div className="space-y-2 text-base-content/70 mb-6">
                                <div className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
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
                                    <span className="font-semibold">
                                        {new Date(kegiatan.tgl_kegiatan).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                {kegiatan.jam_mulai && (
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
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
                                            {kegiatan.jam_mulai}
                                            {kegiatan.jam_seles && ` - ${kegiatan.jam_seles}`}
                                        </span>
                                    </div>
                                )}
                                {kegiatan.kelurahan && (
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
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
                                        <span>
                                            {kegiatan.kelurahan?.nm_kel}, {kegiatan.kelurahan?.kecamatan?.nm_kec},{' '}
                                            {kegiatan.kelurahan?.kecamatan?.kab_kota?.nm_kab},{' '}
                                            {kegiatan.kelurahan?.kecamatan?.kab_kota?.provinsi?.nm_prov}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {kegiatan.ket && (
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap text-base leading-relaxed">{kegiatan.ket}</p>
                                </div>
                            )}
                        </div>
                    </article>

                    {/* Kegiatan Terkait */}
                    {kegiatanTerkait && kegiatanTerkait.length > 0 && (
                        <div className="mt-12" data-aos="fade-up">
                            <h2 className="text-2xl font-bold mb-6">Kegiatan Terkait</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {kegiatanTerkait.map((item) => (
                                    <Link key={item.id} href={`/kegiatan/${item.slug}`}>
                                        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                            <div className="card-body p-4">
                                                <span className="badge badge-secondary badge-sm mb-2">
                                                    {jenisOptions[item.jenis] || item.jenis}
                                                </span>
                                                <h3 className="card-title text-base line-clamp-2">{item.nm_kegiatan}</h3>
                                                <p className="text-xs text-base-content/70">
                                                    {new Date(item.tgl_kegiatan).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <Link href="/kegiatan">
                            <Button variant="ghost">← Kembali ke Daftar Kegiatan</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

