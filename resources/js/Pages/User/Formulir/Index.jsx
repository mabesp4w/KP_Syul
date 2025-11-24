import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';

export default function FormulirIndex({ auth }) {
    const handleDownload = () => {
        // Direct download using window.location
        window.location.href = '/formulir/download';
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Formulir Pendaftaran - PKBM Dabohaley">
                <meta name="description" content="Download formulir pendaftaran PKBM Dabohaley untuk tahun ajaran 2025/2026. Formulir untuk Paket A, B, C, PAUD, dan Keaksaraan Dasar." />
                <meta name="author" content="Syull Wally" />
            </Head>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8" data-aos="fade-down">
                        <h1 className="text-4xl font-bold text-base-content mb-4">Formulir Pendaftaran</h1>
                        <p className="text-lg text-base-content/70">
                            Formulir Pendaftaran Calon Peserta Didik PKBM Dabohaley
                        </p>
                        <p className="text-base text-base-content/60 mt-2">
                            Tahun Ajaran 2025/2026
                        </p>
                    </div>

                    {/* Info Card */}
                    <Card className="mb-8" data-aos="fade-up">
                        <CardHeader>
                            <CardTitle>Informasi Formulir</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Program yang Tersedia:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-base-content/70">
                                        <li>Paket A Setara SD/MI</li>
                                        <li>Paket B Setara SMP/MTS</li>
                                        <li>Paket C Setara SMA/MA</li>
                                        <li>Pendidikan Anak Usia Dini (PAUD)</li>
                                        <li>Program Pendidikan Keaksaraan Dasar (KD)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Persyaratan Dokumen:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-base-content/70">
                                        <li>Akta Kelahiran/Surat Baptis (untuk Paket A)</li>
                                        <li>Ijazah/SKHU SD (untuk Paket B)</li>
                                        <li>Ijazah/SKHU SMP (untuk Paket C)</li>
                                        <li>Kartu Keluarga (KK) - 2 lembar</li>
                                        <li>Foto Pas 2x3 cm - 4 lembar</li>
                                        <li>Surat Pernyataan Kesediaan Mengikuti Pembelajaran</li>
                                    </ul>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Download Section */}
                    <Card className="mb-8" data-aos="fade-up" data-aos-delay="100">
                        <CardHeader>
                            <CardTitle>Download Formulir</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <p className="text-base-content/70">
                                    Silakan download formulir pendaftaran dengan mengklik tombol di bawah ini. 
                                    Formulir dapat diisi secara manual atau dicetak terlebih dahulu.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="flex-1"
                                        onClick={handleDownload}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Download Formulir PDF
                                    </Button>
                                </div>
                                <div className="alert alert-info mt-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6 shrink-0 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <div>
                                        <h3 className="font-bold">Catatan Penting</h3>
                                        <div className="text-xs">
                                            Formulir ini disesuaikan dengan DAPODIKMAS Online. Pastikan semua data yang diisi sesuai dengan dokumen asli.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Contact Info */}
                    <Card data-aos="fade-up" data-aos-delay="200">
                        <CardHeader>
                            <CardTitle>Kontak Informasi</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2 text-base-content/70">
                                <p>
                                    <strong>Alamat:</strong> Jl. Kalkhote RT 02 RW 03 Kampung Nolokla Distrik Sentani Timur Kabupaten Jayapura Propinsi Papua
                                </p>
                                <p>
                                    <strong>Kode Pos:</strong> 99359
                                </p>
                                <p>
                                    <strong>Kontak Person:</strong> HP Nomor: 0813 440 14926
                                </p>
                                <p>
                                    <strong>NPSN:</strong> P9926347
                                </p>
                                <p>
                                    <strong>Akreditasi:</strong> TERAKREDITASI B
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}

