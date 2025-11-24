import UserLayout from '@/Layouts/UserLayout';
import { Head, router } from '@inertiajs/react';
import SearchBox from '@/Components/ui/SearchBox';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useState, useEffect } from 'react';

export default function Index({ auth, galeri, filters }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

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
            `;
            document.head.appendChild(style);
        }
    }, []);

    const handleFilterTipe = (e) => {
        router.get(
            '/galeri',
            { ...filters, tipe: e.target.value !== '' ? e.target.value : null },
            { preserveState: true, replace: true },
        );
    };

    return (
        <UserLayout auth={auth}>
            <Head title="Galeri" />
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8 text-center" data-aos="fade-down">
                    <h1 className="text-4xl font-bold text-base-content">Galeri Foto</h1>
                    <p className="mt-2 text-lg text-base-content/70">Momen-momen kegiatan dan aktivitas</p>
                </div>

                {/* Search and Filters */}
                <div className="card bg-base-200 shadow-sm mb-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="card-body">
                        <div className="grid grid-cols-1 items-end justify-end gap-4 md:grid-cols-2">
                            <SearchBox
                                placeholder="Cari galeri..."
                                defaultValue={filters?.search || ''}
                                route="/galeri"
                                routeParams={filters}
                                debounceMs={500}
                            />
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter Tipe</span>
                                </label>
                                <select
                                    className="select-bordered select w-full"
                                    value={filters?.tipe || ''}
                                    onChange={handleFilterTipe}
                                >
                                    <option value="">Semua Tipe</option>
                                    <option value="umum">Umum</option>
                                    <option value="kegiatan">Kegiatan</option>
                                    <option value="fasilitas">Fasilitas</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                {galeri.data.length === 0 ? (
                    <div className="text-center py-12" data-aos="fade-up">
                        <p className="text-base-content/70">Tidak ada galeri ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
                        {galeri.data.map((item, index) => (
                            <div
                                key={item.id}
                                className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer aspect-square"
                                onClick={() => {
                                    const itemsWithImages = galeri.data.filter((g) => g.gambar);
                                    const idx = itemsWithImages.findIndex((g) => g.id === item.id);
                                    setLightboxIndex(idx >= 0 ? idx : 0);
                                    setLightboxOpen(true);
                                }}
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                <figure className="h-full">
                                    <img
                                        src={item.gambar ? `/storage/${item.gambar}` : '/placeholder-image.jpg'}
                                        alt={item.judul || 'Galeri'}
                                        className="h-full w-full object-cover"
                                    />
                                </figure>
                                {(item.judul || item.kegiatan?.length > 0 || item.fasilitas?.length > 0) && (
                                    <div className="card-body p-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
                                        {item.judul && <h3 className="card-title text-sm text-white line-clamp-1">{item.judul}</h3>}
                                        {item.kegiatan && item.kegiatan.length > 0 && (
                                            <span className="badge badge-primary badge-xs">Kegiatan</span>
                                        )}
                                        {item.fasilitas && item.fasilitas.length > 0 && (
                                            <span className="badge badge-secondary badge-xs">Fasilitas</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galeri.links.length > 3 && (
                    <div className="flex justify-center" data-aos="fade-up">
                        <div className="join">
                            {galeri.links.map((link, index) => (
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

                {/* Lightbox */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={galeri.data
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
            </div>
        </UserLayout>
    );
}

