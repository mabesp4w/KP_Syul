import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';

export default function Show({ auth, programPendidikan, programTerkait }) {
    return (
        <UserLayout auth={auth}>
            <Head title={programPendidikan.nm_prog} />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="text-sm breadcrumbs mb-6" data-aos="fade-down">
                        <ul>
                            <li>
                                <Link href="/">Beranda</Link>
                            </li>
                            <li>
                                <Link href="/program-pendidikan">Program Pendidikan</Link>
                            </li>
                            <li>{programPendidikan.nm_prog}</li>
                        </ul>
                    </div>

                    {/* Article */}
                    <article className="card bg-base-100 shadow-lg" data-aos="fade-up">
                        <div className="card-body">
                            <div className="badge badge-primary badge-lg mb-4">{programPendidikan.kat}</div>
                            <h1 className="text-3xl font-bold mb-4">{programPendidikan.nm_prog}</h1>
                            <div className="prose max-w-none mb-6">
                                <p className="text-base leading-relaxed whitespace-pre-wrap">{programPendidikan.desk}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
                                {programPendidikan.tgt_pst && (
                                    <div className="card bg-base-200">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-full bg-primary/10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-primary"
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
                                                </div>
                                                <div>
                                                    <p className="text-sm text-base-content/70">Target Peserta</p>
                                                    <p className="font-semibold">{programPendidikan.tgt_pst}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {programPendidikan.durasi && (
                                    <div className="card bg-base-200">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-full bg-secondary/10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-secondary"
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
                                                </div>
                                                <div>
                                                    <p className="text-sm text-base-content/70">Durasi</p>
                                                    <p className="font-semibold">{programPendidikan.durasi}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {programPendidikan.biaya !== null && (
                                    <div className="card bg-base-200">
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-full bg-accent/10">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-accent"
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
                                                </div>
                                                <div>
                                                    <p className="text-sm text-base-content/70">Biaya</p>
                                                    <p className="font-semibold">
                                                        {programPendidikan.biaya ? `Rp ${programPendidikan.biaya.toLocaleString('id-ID')}` : 'Gratis'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Program Terkait */}
                    {programTerkait && programTerkait.length > 0 && (
                        <div className="mt-12" data-aos="fade-up">
                            <h2 className="text-2xl font-bold mb-6">Program Terkait</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {programTerkait.map((program) => (
                                    <Link key={program.id} href={`/program-pendidikan/${program.slug}`}>
                                        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                            <div className="card-body p-4">
                                                <span className="badge badge-primary badge-sm mb-2">{program.kat}</span>
                                                <h3 className="card-title text-base line-clamp-2">{program.nm_prog}</h3>
                                                <p className="text-sm text-base-content/70 line-clamp-2">{program.desk}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <Link href="/program-pendidikan">
                            <Button variant="ghost">← Kembali ke Daftar Program</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

