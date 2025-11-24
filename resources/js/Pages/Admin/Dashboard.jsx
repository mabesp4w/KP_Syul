import Badge from '@/Components/ui/Badge';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth, statistics, recent, statistikProgram }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5); // HH:mm format
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            aktif: { variant: 'success', label: 'Aktif' },
            lulus: { variant: 'info', label: 'Lulus' },
            tidak_aktif: { variant: 'error', label: 'Tidak Aktif' },
            cuti: { variant: 'warning', label: 'Cuti' },
            terjadwal: { variant: 'info', label: 'Terjadwal' },
            berlangsung: { variant: 'success', label: 'Berlangsung' },
            selesai: { variant: 'neutral', label: 'Selesai' },
        };

        const statusInfo = statusMap[status] || { variant: 'neutral', label: status };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    return (
        <AdminLayout
            auth={auth}
            title="Dashboard Admin"
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-base-content">Dashboard Admin</h2>
                        <p className="mt-1 text-sm text-base-content/70">Selamat datang, {auth.user.name}! Berikut ringkasan sistem Anda.</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                {/* Welcome Alert */}
                <div className="alert bg-primary shadow-lg" data-aos="fade-down">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <div>
                        <h3 className="font-bold">Selamat Datang di Dashboard Admin!</h3>
                        <div className="text-xs">Kelola semua aspek sistem dari sini. Gunakan menu sidebar untuk navigasi.</div>
                    </div>
                </div>

                {/* Statistics Cards - Row 1 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Total Peserta */}
                    <Card className="to-success-focus bg-gradient-to-br from-success text-success-content" data-aos="fade-up" data-aos-delay="100">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-success-content/80">Total Peserta</p>
                                    <p className="mt-1 text-3xl font-bold">{statistics?.peserta?.total || 0}</p>
                                    <div className="mt-2 flex gap-2">
                                        <Badge variant="success" className="border-0 bg-success-content/30 text-success-content">
                                            Aktif: {statistics?.peserta?.aktif || 0}
                                        </Badge>
                                        <Badge variant="success" className="border-0 bg-success-content/30 text-success-content">
                                            Lulus: {statistics?.peserta?.lulus || 0}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-success-content/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Program */}
                    <Card
                        className="to-secondary-focus bg-gradient-to-br from-secondary text-secondary-content"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-secondary-content/80">Program Pendidikan</p>
                                    <p className="mt-1 text-3xl font-bold">{statistics?.program?.total || 0}</p>
                                    <div className="mt-2">
                                        <Badge variant="info" className="border-0 bg-secondary-content/30 text-secondary-content">
                                            Aktif: {statistics?.program?.aktif || 0}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-secondary-content/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Kegiatan */}
                    <Card className="to-warning-focus bg-gradient-to-br from-warning text-warning-content" data-aos="fade-up" data-aos-delay="300">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-warning-content/80">Total Kegiatan</p>
                                    <p className="mt-1 text-3xl font-bold">{statistics?.kegiatan?.total || 0}</p>
                                    <div className="mt-2 flex gap-2">
                                        <Badge variant="warning" className="border-0 bg-warning-content/30 text-warning-content">
                                            Selesai: {statistics?.kegiatan?.selesai || 0}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-warning-content/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12"
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
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Statistics Cards - Row 2 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Fasilitas */}
                    <Card data-aos="fade-up" data-aos-delay="400">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-base-content/70">Fasilitas</p>
                                    <p className="mt-1 text-2xl font-bold">{statistics?.fasilitas?.total || 0}</p>
                                    <p className="mt-1 text-xs text-base-content/60">{statistics?.fasilitas?.tersedia || 0} tersedia</p>
                                </div>
                                <div className="text-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Berita */}
                    <Card data-aos="fade-up" data-aos-delay="500">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-base-content/70">Berita</p>
                                    <p className="mt-1 text-2xl font-bold">{statistics?.berita?.total || 0}</p>
                                    <p className="mt-1 text-xs text-base-content/60">{statistics?.berita?.published || 0} dipublikasikan</p>
                                </div>
                                <div className="text-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Galeri */}
                    <Card data-aos="fade-up" data-aos-delay="600">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-base-content/70">Galeri</p>
                                    <p className="mt-1 text-2xl font-bold">{statistics?.galeri?.total || 0}</p>
                                    <p className="mt-1 text-xs text-base-content/60">Total foto</p>
                                </div>
                                <div className="text-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Kegiatan Terbaru */}
                    <Card data-aos="fade-right" data-aos-delay="700">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Kegiatan Terbaru</CardTitle>
                                {(() => {
                                    try {
                                        return (
                                            <Link href={route('admin.kegiatan.index')} className="btn btn-ghost btn-sm">
                                                Lihat Semua
                                            </Link>
                                        );
                                    } catch {
                                        return null;
                                    }
                                })()}
                            </div>
                        </CardHeader>
                        <CardBody>
                            {recent?.kegiatan && recent.kegiatan.length > 0 ? (
                                <div className="space-y-3">
                                    {recent.kegiatan.map((kegiatan) => (
                                        <div
                                            key={kegiatan.id}
                                            className="flex items-start justify-between rounded-lg bg-base-200 p-3 transition-colors hover:bg-base-300"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold">{kegiatan.nm_kegiatan}</h4>
                                                <p className="mt-1 text-xs text-base-content/70">
                                                    {kegiatan.nama_kelurahan || 'Kelurahan tidak diketahui'}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs text-base-content/60">{formatDate(kegiatan.tgl_kegiatan)}</span>
                                                    {kegiatan.jam_mulai && (
                                                        <span className="text-xs text-base-content/60">• {formatTime(kegiatan.jam_mulai)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-3">{getStatusBadge(kegiatan.status)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-base-content/50">
                                    <p>Tidak ada kegiatan terbaru</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Peserta Terbaru */}
                    <Card data-aos="fade-left" data-aos-delay="700">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Peserta Terbaru</CardTitle>
                                {(() => {
                                    try {
                                        return (
                                            <Link href={route('admin.peserta.index')} className="btn btn-ghost btn-sm">
                                                Lihat Semua
                                            </Link>
                                        );
                                    } catch {
                                        return null;
                                    }
                                })()}
                            </div>
                        </CardHeader>
                        <CardBody>
                            {recent?.peserta && recent.peserta.length > 0 ? (
                                <div className="space-y-3">
                                    {recent.peserta.map((peserta) => (
                                        <div
                                            key={peserta.id}
                                            className="flex items-start justify-between rounded-lg bg-base-200 p-3 transition-colors hover:bg-base-300"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold">{peserta.nm_lengkap}</h4>
                                                <p className="mt-1 text-xs text-base-content/70">
                                                    {peserta.nama_program || 'Program tidak diketahui'}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs text-base-content/60">No. Induk: {peserta.no_induk}</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">{getStatusBadge(peserta.status)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-base-content/50">
                                    <p>Tidak ada peserta terbaru</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Statistik Program & Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Statistik per Program */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Peserta per Program</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {statistikProgram && statistikProgram.length > 0 ? (
                                <div className="space-y-3">
                                    {statistikProgram.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.nama_program}</p>
                                                <div className="mt-2 h-2 w-full rounded-full bg-base-200">
                                                    <div
                                                        className="h-2 rounded-full bg-primary transition-all"
                                                        style={{
                                                            width: `${(item.total / (statistics?.peserta?.total || 1)) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <Badge variant="primary">{item.total} peserta</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-base-content/50">
                                    <p>Belum ada data statistik program</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-2 gap-3">
                                {(() => {
                                    try {
                                        return (
                                            <Link href={route('admin.pengguna.index')} className="btn btn-block btn-primary">
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
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                    />
                                                </svg>
                                                Kelola Pengguna
                                            </Link>
                                        );
                                    } catch {
                                        return (
                                            <button className="btn btn-block btn-primary" disabled>
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
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                    />
                                                </svg>
                                                Kelola Pengguna
                                            </button>
                                        );
                                    }
                                })()}
                                {(() => {
                                    try {
                                        return (
                                            <Link href={route('admin.peserta.index')} className="btn btn-block btn-success">
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
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                Kelola Peserta
                                            </Link>
                                        );
                                    } catch {
                                        return (
                                            <button className="btn btn-block btn-success" disabled>
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
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                Kelola Peserta
                                            </button>
                                        );
                                    }
                                })()}
                                {(() => {
                                    try {
                                        return (
                                            <Link href={route('admin.kegiatan.index')} className="btn btn-block btn-warning">
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
                                                Kelola Kegiatan
                                            </Link>
                                        );
                                    } catch {
                                        return (
                                            <button className="btn btn-block btn-warning" disabled>
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
                                                Kelola Kegiatan
                                            </button>
                                        );
                                    }
                                })()}
                                {(() => {
                                    try {
                                        return (
                                            <Link href={route('admin.pengaturan.index')} className="btn btn-block btn-outline">
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
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                Pengaturan
                                            </Link>
                                        );
                                    } catch {
                                        return (
                                            <button className="btn btn-block btn-outline" disabled>
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
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                Pengaturan
                                            </button>
                                        );
                                    }
                                })()}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
