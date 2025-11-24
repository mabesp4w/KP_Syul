import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useState, useEffect } from 'react';

export default function Home({ auth, beritaTerbaru, kegiatanTerbaru, galeriTerbaru, programPendidikan }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Inject custom styles for lightbox blur
    useEffect(() => {
        const styleId = 'lightbox-blur-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .yarl__backdrop {
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                    background-color: rgba(0, 0, 0, 0.2) !important;
                }
                .yarl__container {
                    background-color: transparent !important;
                }
                .yarl__root {
                    --yarl__color_backdrop: rgba(0, 0, 0, 0.2) !important;
                }
                .yarl__root .yarl__backdrop {
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                    background-color: rgba(0, 0, 0, 0.2) !important;
                }
                /* Ensure parent elements support backdrop-filter */
                .yarl__root,
                .yarl__root > div {
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Auto-play carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 5);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Handle manual navigation
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

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

    return (
        <UserLayout auth={auth}>
            <Head title="Beranda">
                <meta name="description" content="Selamat Datang di PKBM Dabohaley - Pusat Kegiatan Belajar Masyarakat yang menyediakan berbagai program pendidikan untuk masyarakat. Dikelola oleh Syull Wally." />
                <meta name="author" content="Syull Wally" />
                <meta name="keywords" content="PKBM Dabohaley, pendidikan, belajar masyarakat, Syull Wally, pendidikan non formal, paket A, paket B, paket C, PAUD" />
                
                {/* Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "EducationalOrganization",
                            "name": "PKBM Dabohaley",
                            "description": "Pusat Kegiatan Belajar Masyarakat (PKBM) Dabohaley - Website Promosi Pendidikan",
                            "url": typeof window !== 'undefined' ? window.location.origin : '',
                            "founder": {
                                "@type": "Person",
                                "name": "Syull Wally"
                            }
                        })
                    }}
                />
            </Head>

            {/* Carousel Hero Section */}
            <div className="w-full h-[70vh] relative overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                >
                {/* Slide 1 - Fade In Effect */}
                <div
                    id="slide1"
                    className="relative w-full flex-shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url('/images/bg/bg1.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="text-center text-white relative z-10 w-full px-4">
                        <div className="max-w-2xl mx-auto">
                            <h1 className={`mb-5 text-5xl font-bold ${currentSlide === 0 ? 'animate-fade-in-up' : 'opacity-0'}`}>
                                Selamat Datang di PKBM Dabohaley
                            </h1>
                            <p className={`mb-3 text-xl font-semibold ${currentSlide === 0 ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}>
                                Pusat Kegiatan Belajar Masyarakat (PKBM) Dabohaley
                            </p>
                            <p className={`mb-5 text-lg ${currentSlide === 0 ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'}`}>
                            Website Promosi Pendidikan PKBM Dabohaley - Mari bersama-sama membangun pendidikan yang lebih baik untuk masyarakat.
                        </p>
                            <div className={`flex gap-4 justify-center ${currentSlide === 0 ? 'animate-fade-in-up animation-delay-600' : 'opacity-0'}`}>
                            <Link href="/program-pendidikan">
                                <Button variant="primary" size="lg">
                                    Lihat Program
                                </Button>
                            </Link>
                            <Link href="/kegiatan">
                                    <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                                        Lihat Kegiatan
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide 2 - Slide In From Left Effect */}
                <div
                    id="slide2"
                    className="relative w-full flex-shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url('/images/bg/bg2.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="text-center text-white relative z-10 w-full px-4">
                        <div className="max-w-2xl mx-auto">
                            <h1 className={`mb-5 text-5xl font-bold ${currentSlide === 1 ? 'animate-slide-in-left' : 'opacity-0'}`}>
                                Membangun Masa Depan
                            </h1>
                            <p className={`mb-5 text-xl font-semibold ${currentSlide === 1 ? 'animate-slide-in-left animation-delay-300' : 'opacity-0'}`}>
                                Bersama PKBM Dabohaley
                            </p>
                            <p className={`mb-5 text-lg ${currentSlide === 1 ? 'animate-slide-in-left animation-delay-500' : 'opacity-0'}`}>
                                Pendidikan berkualitas untuk semua kalangan masyarakat, menciptakan generasi yang berkarakter dan berdaya saing.
                            </p>
                            <div className={`flex gap-4 justify-center ${currentSlide === 1 ? 'animate-slide-in-left animation-delay-700' : 'opacity-0'}`}>
                                <Link href="/program-pendidikan">
                                    <Button variant="primary" size="lg">
                                        Program Kami
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide 3 - Zoom In Effect */}
                <div
                    id="slide3"
                    className="relative w-full flex-shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url('/images/bg/bg3.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="text-center text-white relative z-10 w-full px-4">
                        <div className="max-w-2xl mx-auto">
                            <h1 className={`mb-5 text-5xl font-bold ${currentSlide === 2 ? 'animate-zoom-in' : 'opacity-0'}`}>
                                Pendidikan Untuk Semua
                            </h1>
                            <p className={`mb-5 text-xl font-semibold ${currentSlide === 2 ? 'animate-zoom-in animation-delay-200' : 'opacity-0'}`}>
                                Akses Pendidikan Tanpa Batas
                            </p>
                            <p className={`mb-5 text-lg ${currentSlide === 2 ? 'animate-zoom-in animation-delay-400' : 'opacity-0'}`}>
                                Dari PAUD hingga Paket C, dari keaksaraan hingga kursus keterampilan - kami hadir untuk semua.
                            </p>
                            <div className={`flex gap-4 justify-center ${currentSlide === 2 ? 'animate-zoom-in animation-delay-600' : 'opacity-0'}`}>
                                <Link href="/galeri">
                                    <Button variant="primary" size="lg">
                                        Lihat Galeri
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide 4 - Slide In From Right Effect */}
                <div
                    id="slide4"
                    className="relative w-full flex-shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url('/images/bg/bg4.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="text-center text-white relative z-10 w-full px-4">
                        <div className="max-w-2xl mx-auto">
                            <h1 className={`mb-5 text-5xl font-bold ${currentSlide === 3 ? 'animate-slide-in-right' : 'opacity-0'}`}>
                                Kegiatan Berkelanjutan
                            </h1>
                            <p className={`mb-5 text-xl font-semibold ${currentSlide === 3 ? 'animate-slide-in-right animation-delay-300' : 'opacity-0'}`}>
                                Aktifitas Pembelajaran Terpadu
                            </p>
                            <p className={`mb-5 text-lg ${currentSlide === 3 ? 'animate-slide-in-right animation-delay-500' : 'opacity-0'}`}>
                                Berbagai kegiatan pembelajaran yang menarik dan bermanfaat untuk meningkatkan kualitas pendidikan masyarakat.
                            </p>
                            <div className={`flex gap-4 justify-center ${currentSlide === 3 ? 'animate-slide-in-right animation-delay-700' : 'opacity-0'}`}>
                                <Link href="/kegiatan">
                                    <Button variant="primary" size="lg">
                                    Lihat Kegiatan
                                </Button>
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide 5 - Bounce In Effect */}
                <div
                    id="slide5"
                    className="relative w-full flex-shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url('/images/bg/bg5.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="text-center text-white relative z-10 w-full px-4">
                        <div className="max-w-2xl mx-auto">
                            <h1 className={`mb-5 text-5xl font-bold ${currentSlide === 4 ? 'animate-bounce-in' : 'opacity-0'}`}>
                                Bergabung Bersama Kami
                            </h1>
                            <p className={`mb-5 text-xl font-semibold ${currentSlide === 4 ? 'animate-bounce-in animation-delay-200' : 'opacity-0'}`}>
                                Wujudkan Impian Pendidikan Anda
                            </p>
                            <p className={`mb-5 text-lg ${currentSlide === 4 ? 'animate-bounce-in animation-delay-400' : 'opacity-0'}`}>
                                Daftarkan diri Anda sekarang dan mulailah perjalanan pendidikan yang akan mengubah hidup Anda.
                            </p>
                            <div className={`flex gap-4 justify-center ${currentSlide === 4 ? 'animate-bounce-in animation-delay-600' : 'opacity-0'}`}>
                                <Link href="/program-pendidikan">
                                    <Button variant="primary" size="lg">
                                        Daftar Sekarang
                                    </Button>
                                </Link>
                                <Link href="/berita">
                                    <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                                        Berita Terbaru
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center w-full py-2 gap-2 bg-base-200">
                <button
                    className={`btn btn-xs ${currentSlide === 0 ? 'btn-active' : ''}`}
                    onClick={() => goToSlide(0)}
                >
                    1
                </button>
                <button
                    className={`btn btn-xs ${currentSlide === 1 ? 'btn-active' : ''}`}
                    onClick={() => goToSlide(1)}
                >
                    2
                </button>
                <button
                    className={`btn btn-xs ${currentSlide === 2 ? 'btn-active' : ''}`}
                    onClick={() => goToSlide(2)}
                >
                    3
                </button>
                <button
                    className={`btn btn-xs ${currentSlide === 3 ? 'btn-active' : ''}`}
                    onClick={() => goToSlide(3)}
                >
                    4
                </button>
                <button
                    className={`btn btn-xs ${currentSlide === 4 ? 'btn-active' : ''}`}
                    onClick={() => goToSlide(4)}
                >
                    5
                </button>
            </div>

            {/* Program Pendidikan Section */}
            {programPendidikan && programPendidikan.length > 0 && (
                <section className="py-16 bg-base-200" data-aos="fade-up">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-base-content">Program Pendidikan</h2>
                                <p className="mt-2 text-base-content/70">Program pendidikan yang tersedia untuk Anda</p>
                            </div>
                            <Link href="/program-pendidikan">
                                <Button variant="ghost">Lihat Semua →</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {programPendidikan.slice(0, 6).map((program) => (
                                <Link key={program.id} href={`/program-pendidikan/${program.slug}`}>
                                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                                        <div className="card-body">
                                            <h3 className="card-title text-lg">{program.nm_prog}</h3>
                                            <div className="badge badge-primary badge-sm">{program.kat}</div>
                                            <p className="text-sm text-base-content/70 line-clamp-3 mt-2">{program.desk}</p>
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
                    </div>
                </section>
            )}

            {/* Berita Section */}
            {beritaTerbaru && beritaTerbaru.length > 0 && (
                <section className="py-16 bg-base-100" data-aos="fade-up">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-base-content">Berita Terbaru</h2>
                                <p className="mt-2 text-base-content/70">Informasi dan pengumuman terbaru</p>
                            </div>
                            <Link href="/berita">
                                <Button variant="ghost">Lihat Semua →</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {beritaTerbaru.map((berita) => (
                                <Link key={berita.id} href={`/berita/${berita.slug}`}>
                                    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                                        {berita.foto_utama && (
                                            <figure className="aspect-video">
                                                <img
                                                    src={`/storage/${berita.foto_utama}`}
                                                    alt={berita.judul}
                                                    className="h-full w-full object-cover"
                                                />
                                            </figure>
                                        )}
                                        <div className="card-body">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="badge badge-primary badge-sm">
                                                    {kategoriOptions[berita.kat] || berita.kat}
                                                </span>
                                                <span className="text-xs text-base-content/50">
                                                    {new Date(berita.tgl_pub).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                            <h3 className="card-title text-lg line-clamp-2">{berita.judul}</h3>
                                            <p className="text-sm text-base-content/70 line-clamp-3">
                                                {getTextPreview(berita.isi, 150)}
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
                    </div>
                </section>
            )}

            {/* Kegiatan Section */}
            {kegiatanTerbaru && kegiatanTerbaru.length > 0 && (
                <section className="py-16 bg-base-200" data-aos="fade-up">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-base-content">Kegiatan Terbaru</h2>
                                <p className="mt-2 text-base-content/70">Kegiatan yang akan datang dan sedang berlangsung</p>
                            </div>
                            <Link href="/kegiatan">
                                <Button variant="ghost">Lihat Semua →</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {kegiatanTerbaru.map((kegiatan) => (
                                <Link key={kegiatan.id} href={`/kegiatan/${kegiatan.slug}`}>
                                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                                        <div className="card-body">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="badge badge-secondary badge-sm">{kegiatan.jenis}</span>
                                                <span className="badge badge-outline badge-sm">{kegiatan.status}</span>
                                            </div>
                                            <h3 className="card-title text-lg">{kegiatan.nm_kegiatan}</h3>
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
                                                    <span>{new Date(kegiatan.tgl_kegiatan).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                {kegiatan.jam_mulai && (
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
                                                            {kegiatan.jam_mulai}
                                                            {kegiatan.jam_seles && ` - ${kegiatan.jam_seles}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {kegiatan.ket && (
                                                <p className="text-sm text-base-content/70 line-clamp-2 mt-2">{kegiatan.ket}</p>
                                            )}
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
                    </div>
                </section>
            )}

            {/* Galeri Section */}
            {galeriTerbaru && galeriTerbaru.length > 0 && (
                <section className="py-16 bg-base-100" data-aos="fade-up">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-base-content">Galeri Foto</h2>
                                <p className="mt-2 text-base-content/70">Momen-momen kegiatan dan aktivitas</p>
                            </div>
                            <Link href="/galeri">
                                <Button variant="ghost">Lihat Semua →</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {galeriTerbaru.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer aspect-square"
                                    onClick={() => {
                                        const itemsWithImages = galeriTerbaru.filter((g) => g.gambar);
                                        const idx = itemsWithImages.findIndex((g) => g.id === item.id);
                                        setLightboxIndex(idx >= 0 ? idx : 0);
                                        setLightboxOpen(true);
                                    }}
                                >
                                    <figure className="h-full">
                                        <img
                                            src={item.gambar ? `/storage/${item.gambar}` : '/placeholder-image.jpg'}
                                            alt={item.judul || 'Galeri'}
                                            className="h-full w-full object-cover"
                                        />
                                    </figure>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={galeriTerbaru
                    .filter((item) => item.gambar)
                    .map((item) => ({
                        src: `/storage/${item.gambar}`,
                        alt: item.judul || 'Galeri',
                        description: item.desk || undefined,
                    }))}
                styles={{
                    container: { backgroundColor: 'transparent' },
                    backdrop: {
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    },
                }}
            />
        </UserLayout>
    );
}

