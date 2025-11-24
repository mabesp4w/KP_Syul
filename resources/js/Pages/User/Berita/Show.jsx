import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/ui/Button';

export default function Show({ auth, berita, beritaTerkait }) {
    const kategoriOptions = {
        pengumuman: 'Pengumuman',
        acara: 'Acara',
        prestasi: 'Prestasi',
        info_umum: 'Info Umum',
    };

    // Helper function to strip HTML and get plain text
    const getPlainText = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };

    const description = getPlainText(berita.isi).substring(0, 160) || berita.judul;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const imageUrl = berita.foto_utama ? `${baseUrl}/storage/${berita.foto_utama}` : '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : baseUrl;

    return (
        <UserLayout auth={auth}>
            <Head title={berita.judul}>
                {/* SEO Meta Tags */}
                <meta name="description" content={description} />
                <meta name="author" content={berita.penulis || 'Syull Wally'} />
                <meta name="keywords" content={`${berita.judul}, ${kategoriOptions[berita.kat] || berita.kat}, PKBM Dabohaley, Syull Wally`} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={berita.judul} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={currentUrl} />
                {imageUrl && <meta property="og:image" content={imageUrl} />}
                <meta property="og:site_name" content="PKBM Dabohaley" />
                <meta property="article:author" content={berita.penulis || 'Syull Wally'} />
                <meta property="article:published_time" content={new Date(berita.tgl_pub).toISOString()} />
                <meta property="article:section" content={kategoriOptions[berita.kat] || berita.kat} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={berita.judul} />
                <meta name="twitter:description" content={description} />
                {imageUrl && <meta name="twitter:image" content={imageUrl} />}
                <meta name="twitter:creator" content="@SyullWally" />
                
                {/* Article Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": berita.judul,
                            "description": description,
                            "image": imageUrl,
                            "datePublished": new Date(berita.tgl_pub).toISOString(),
                            "dateModified": new Date(berita.updated_at || berita.tgl_pub).toISOString(),
                            "author": {
                                "@type": "Person",
                                "name": berita.penulis || "Syull Wally",
                                "url": baseUrl,
                                "jobTitle": "Pengelola PKBM Dabohaley"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "PKBM Dabohaley",
                                "url": baseUrl
                            },
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": currentUrl
                            }
                        })
                    }}
                />
            </Head>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="text-sm breadcrumbs mb-6" data-aos="fade-down">
                        <ul>
                            <li>
                                <Link href="/">Beranda</Link>
                            </li>
                            <li>
                                <Link href="/berita">Berita</Link>
                            </li>
                            <li>{berita.judul}</li>
                        </ul>
                    </div>

                    {/* Article */}
                    <article className="card bg-base-100 shadow-lg" data-aos="fade-up">
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
                            <div className="flex items-center gap-2 mb-4">
                                <span className="badge badge-primary">{kategoriOptions[berita.kat] || berita.kat}</span>
                                <span className="text-sm text-base-content/70">
                                    {new Date(berita.tgl_pub).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{berita.judul}</h1>
                            <div className="flex items-center gap-2 mb-6 text-base-content/70">
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
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span>Oleh: <strong>{berita.penulis || 'Syull Wally'}</strong></span>
                            </div>
                            <div 
                                className="prose prose-lg max-w-none 
                                    prose-headings:font-bold prose-headings:text-base-content 
                                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg
                                    prose-p:text-base-content prose-p:leading-relaxed prose-p:mb-4
                                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-base-content prose-strong:font-semibold
                                    prose-ul:text-base-content prose-ol:text-base-content prose-li:text-base-content
                                    prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                                    prose-code:text-sm prose-code:bg-base-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                    prose-pre:bg-base-200 prose-pre:text-base-content
                                    prose-table:w-full prose-th:border prose-th:border-base-300 prose-th:p-2 prose-th:bg-base-200
                                    prose-td:border prose-td:border-base-300 prose-td:p-2"
                                dangerouslySetInnerHTML={{ __html: berita.isi }}
                            />
                        </div>
                    </article>

                    {/* Berita Terkait */}
                    {beritaTerkait && beritaTerkait.length > 0 && (
                        <div className="mt-12" data-aos="fade-up">
                            <h2 className="text-2xl font-bold mb-6">Berita Terkait</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {beritaTerkait.map((item) => (
                                    <Link key={item.id} href={`/berita/${item.slug}`}>
                                        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                                            {item.foto_utama && (
                                                <figure className="aspect-video">
                                                    <img
                                                        src={`/storage/${item.foto_utama}`}
                                                        alt={item.judul}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </figure>
                                            )}
                                            <div className="card-body p-4">
                                                <span className="badge badge-primary badge-sm mb-2">
                                                    {kategoriOptions[item.kat] || item.kat}
                                                </span>
                                                <h3 className="card-title text-base line-clamp-2">{item.judul}</h3>
                                                <p className="text-xs text-base-content/70">
                                                    {new Date(item.tgl_pub).toLocaleDateString('id-ID')}
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
                        <Link href="/berita">
                            <Button variant="ghost">← Kembali ke Daftar Berita</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

